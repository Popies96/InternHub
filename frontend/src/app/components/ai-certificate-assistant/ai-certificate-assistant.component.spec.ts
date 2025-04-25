import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiCertificateAssistantComponent } from './ai-certificate-assistant.component';

describe('AiCertificateAssistantComponent', () => {
  let component: AiCertificateAssistantComponent;
  let fixture: ComponentFixture<AiCertificateAssistantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AiCertificateAssistantComponent]
    });
    fixture = TestBed.createComponent(AiCertificateAssistantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
