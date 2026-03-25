import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-formulario-ruta',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario-ruta.html',
  styleUrl: './formulario-ruta.css',
})
export class FormularioRuta {
  formularioRuta: FormGroup;

  constructor (private fb: FormBuilder) {
    // Definimos los campos del formulario y sus validaciones
    this.formularioRuta = this.fb.group({
      origen: ['', [Validators.required, Validators.minLength(3)]],
      destino: ['', [Validators.required, Validators.minLength(3)]],
      intensidad: ['curvy'] // valor por defecto para el tipo de ruta
    });
  }

  onSubmit() {
    if (this.formularioRuta.valid) {
      console.log("Datos del formulario:", this.formularioRuta.value);
      // Aquí es donde más adelante llamaremos a nuestro Backend
      alert(`Buscando ruta motera desde ${this.formularioRuta.value.origen} hasta ${this.formularioRuta.value.destino}...`);
    }
  }
}
