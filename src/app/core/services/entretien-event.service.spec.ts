import { TestBed } from '@angular/core/testing';

import { EntretienEventService } from './entretien-event.service';

describe('EntretienEventService', () => {
  let service: EntretienEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntretienEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
