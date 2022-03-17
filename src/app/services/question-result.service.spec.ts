import { TestBed } from '@angular/core/testing';

import { QuestionResultService } from './question-result.service';

describe('QuestionResultService', () => {
  let service: QuestionResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
