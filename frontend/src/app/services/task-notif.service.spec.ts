import { TestBed } from '@angular/core/testing';

import { TaskNotifService } from './task-notif.service';

describe('TaskNotifService', () => {
  let service: TaskNotifService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskNotifService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
