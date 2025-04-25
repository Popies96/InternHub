import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatpopupComponent } from './chatpopup.component';

describe('ChatpopupComponent', () => {
  let component: ChatpopupComponent;
  let fixture: ComponentFixture<ChatpopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatpopupComponent]
    });
    fixture = TestBed.createComponent(ChatpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
