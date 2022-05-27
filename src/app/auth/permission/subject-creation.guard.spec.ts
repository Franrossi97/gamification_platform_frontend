import { TestBed } from '@angular/core/testing';

import { SubjectCreationGuard } from './subject-creation.guard';

describe('SubjectCreationGuard', () => {
  let guard: SubjectCreationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SubjectCreationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
