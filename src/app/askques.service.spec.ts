import { TestBed } from '@angular/core/testing';

import { AskQuesService } from './askques.service';

describe('TodoListService', () => {
  let service: AskQuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AskQuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
