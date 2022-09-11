import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLevelInformationComponent } from './edit-level-information.component';

describe('EditLevelInformationComponent', () => {
  let component: EditLevelInformationComponent;
  let fixture: ComponentFixture<EditLevelInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLevelInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLevelInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
