import { TestBed } from '@angular/core/testing';

import { SignLanguageService } from './sign-language.service';

describe('SignLanguageService', () => {
  let service: SignLanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignLanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
