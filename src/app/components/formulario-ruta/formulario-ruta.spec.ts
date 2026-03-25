import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioRuta } from './formulario-ruta';

describe('FormularioRuta', () => {
  let component: FormularioRuta;
  let fixture: ComponentFixture<FormularioRuta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioRuta],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioRuta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
