import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelQuestionsComponent } from './level-questions.component';

describe('LevelQuestionsComponent', () => {
  let component: LevelQuestionsComponent;
  let fixture: ComponentFixture<LevelQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LevelQuestionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
