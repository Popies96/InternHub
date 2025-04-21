import { TestBed } from '@angular/core/testing';

import { InternshipAiService } from './internship-ai.service';

describe('InternshipAiService', () => {
  let service: InternshipAiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternshipAiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
