import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectQuestionTypeComponent } from './select-question-type.component';

describe('SelectQuestionTypeComponent', () => {
  let component: SelectQuestionTypeComponent;
  let fixture: ComponentFixture<SelectQuestionTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectQuestionTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectQuestionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
