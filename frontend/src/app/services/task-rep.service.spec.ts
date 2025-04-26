import { TestBed } from '@angular/core/testing';

import { TaskRepService } from './task-rep.service';

describe('TaskRepService', () => {
  let service: TaskRepService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskRepService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
