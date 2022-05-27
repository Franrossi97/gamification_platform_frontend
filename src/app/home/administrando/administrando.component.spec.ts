import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrandoComponent } from './administrando.component';

describe('AdministrandoComponent', () => {
  let component: AdministrandoComponent;
  let fixture: ComponentFixture<AdministrandoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministrandoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrandoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
