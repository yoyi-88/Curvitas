import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-formulario-ruta',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario-ruta.html',
  styleUrl: './formulario-ruta.css',
})
export class FormularioRuta {
  formularioRuta: FormGroup;

  // Nuevas variables para guardar el estado
  rutaGenerada: any = null;
  urlMapa: string = '';
  cargando: boolean = false;
  mensajeError: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private cdr: ChangeDetectorRef) {
    this.formularioRuta = this.fb.group({
      origen: ['', [Validators.required, Validators.minLength(3)]],
      destino: ['', [Validators.required, Validators.minLength(3)]],
      intensidad: ['curvy'],
      duracion: ['media']
    });
  }

  onSubmit() {
    if (this.formularioRuta.valid) {
      this.cargando = true;
      this.rutaGenerada = null;

      this.http.post('https://curvitasbackend-production.up.railway.app/api/plan-route', this.formularioRuta.value)
        .subscribe({
          next: (response: any) => {
            this.rutaGenerada = response;
            this.urlMapa = this.construirUrlMapa(
              this.formularioRuta.value.origen,
              this.formularioRuta.value.destino,
              response.waypoints
            );
            this.cargando = false;

            // 3. ¡LA MAGIA! Forzamos a Angular a mirar los cambios
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.cargando = false;
            this.cdr.detectChanges(); // También aquí por si acaso
          }
        });
    }
  }

  // Función que fabrica el enlace
  // Cambiamos el tipo de string[] a any[] porque ahora son objetos
  construirUrlMapa(origen: string, destino: string, waypoints: string[]): string {
    const baseUrl = 'https://www.google.com/maps/dir/?api=1';
    const origenUrl = encodeURIComponent(origen);
    const destinoUrl = encodeURIComponent(destino);
    
    let url = `${baseUrl}&origin=${origenUrl}&destination=${destinoUrl}&travelmode=driving`;

    if (waypoints && waypoints.length > 0) {
      // encodeURIComponent directamente del string
      const waypointsJuntos = waypoints.map(wp => encodeURIComponent(wp)).join('|');
      url += `&waypoints=${waypointsJuntos}`;
    }

    return url;
  }

  obtenerUbicacion() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Extraemos latitud y longitud y las ponemos en el formulario
          const coords = `${position.coords.latitude},${position.coords.longitude}`;
          this.formularioRuta.patchValue({ origen: coords });
        },
        (error) => {
          console.error("Error obteniendo ubicación", error);
          this.mensajeError = "Illo; pa' se' sincero algo no ha io como debería, inténtalo en un ratillo ¿no?";
        }
      );
    } else {
      alert("Tu navegador no soporta la geolocalización.");
    }
  }
}
