import { TestBed } from '@angular/core/testing';

import { SubjectViewGuard } from './subject-view.guard';

describe('SubjectViewGuard', () => {
  let guard: SubjectViewGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SubjectViewGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
