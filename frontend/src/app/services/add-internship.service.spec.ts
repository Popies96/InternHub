import { TestBed } from '@angular/core/testing';

import { AddInternshipService } from './add-internship.service';

describe('AddInternshipService', () => {
  let service: AddInternshipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddInternshipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
