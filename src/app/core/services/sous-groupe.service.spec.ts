import { TestBed } from '@angular/core/testing';

import { SousGroupeService } from './sous-groupe.service';

describe('SousGroupeService', () => {
  let service: SousGroupeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SousGroupeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
