import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignLanguageDetectorComponent } from './sign-language-detector.component';

describe('SignLanguageDetectorComponent', () => {
  let component: SignLanguageDetectorComponent;
  let fixture: ComponentFixture<SignLanguageDetectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignLanguageDetectorComponent]
    });
    fixture = TestBed.createComponent(SignLanguageDetectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
