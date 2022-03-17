import { TestBed } from '@angular/core/testing';

import { FlashcardsPermissionGuard } from './flashcards-permission.guard';

describe('FlashcardsPermissionGuard', () => {
  let guard: FlashcardsPermissionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(FlashcardsPermissionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
