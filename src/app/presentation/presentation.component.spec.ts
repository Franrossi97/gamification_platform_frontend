import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, inject, tick, fakeAsync } from '@angular/core/testing';

//import { DebugElement } from '@angular/core';
//import { By } from '@angular/platform-browser';

import { PresentationComponent } from './presentation.component';

describe('PresentationComponent', () => {
  let component: PresentationComponent;
  let fixture: ComponentFixture<PresentationComponent>;
  //let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [ PresentationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  /*
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('block_names', () => {
    expect(component.blockNames).length==4;

    console.log(component.blockNames.length);

    expect(component.blockNames).toEqual(['Juego', 'Diversión', 'Flashcards', 'Competencia']);
  });

  it('should create', () => {
    expect(component.description).length==2;
    expect(component.blockNames).toEqual(['Plataforma de gamificación de la Facultad de Ingeniería',
    `El objetivo de la plataforma es lograr que los estudiantes de la facultad tengan una mejor y
    más profundo entendimiento de los temas dictados en clase. La plataforma actualmente es un prototipo y puede contener errores.`]);
  });*/



});
