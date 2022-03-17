import { TestBed } from '@angular/core/testing';

import { CreateFlashcardGuard } from './create-flashcard.guard';

describe('CreateFlashcardGuard', () => {
  let guard: CreateFlashcardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CreateFlashcardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
