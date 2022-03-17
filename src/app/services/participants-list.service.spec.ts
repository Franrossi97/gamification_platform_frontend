import { TestBed } from '@angular/core/testing';

import { ParticipantsListService } from './participants-list.service';

describe('ParticipantsListService', () => {
  let service: ParticipantsListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticipantsListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
