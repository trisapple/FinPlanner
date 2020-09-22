import { TestBed } from '@angular/core/testing';

import { SaltedgeService } from './saltedge.service';

describe('SaltedgeService', () => {
  let service: SaltedgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaltedgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
