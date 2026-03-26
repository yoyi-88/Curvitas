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

  constructor(private fb: FormBuilder, private http: HttpClient, private cdr: ChangeDetectorRef) {
    this.formularioRuta = this.fb.group({
      origen: ['', [Validators.required, Validators.minLength(3)]],
      destino: ['', [Validators.required, Validators.minLength(3)]],
      intensidad: ['curvy']
    });
  }

  onSubmit() {
    if (this.formularioRuta.valid) {
      this.cargando = true;
      this.rutaGenerada = null;

      this.http.post('https://curvitasbackend-production.up.railway.app', this.formularioRuta.value)
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
  construirUrlMapa(origen: string, destino: string, waypoints: string[]): string {
    const baseUrl = 'https://www.google.com/maps/dir/?api=1';
    
    // Limpiamos los textos (espacios, tildes, etc.)
    const origenUrl = encodeURIComponent(origen);
    const destinoUrl = encodeURIComponent(destino);
    
    let url = `${baseUrl}&origin=${origenUrl}&destination=${destinoUrl}&travelmode=driving`;

    // Si hay waypoints, los unimos con "|"
    if (waypoints && waypoints.length > 0) {
      const waypointsJuntos = waypoints.map(wp => encodeURIComponent(wp)).join('|');
      url += `&waypoints=${waypointsJuntos}`;
    }

    return url;
  }
}
