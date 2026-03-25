import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormularioRuta } from './components/formulario-ruta/formulario-ruta';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormularioRuta],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('curvitas');
}
