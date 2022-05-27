import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursandoComponent } from './cursando.component';

describe('CursandoComponent', () => {
  let component: CursandoComponent;
  let fixture: ComponentFixture<CursandoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursandoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CursandoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
