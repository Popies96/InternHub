import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeComponent } from './ide.component';

describe('IdeComponent', () => {
  let component: IdeComponent;
  let fixture: ComponentFixture<IdeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IdeComponent]
    });
    fixture = TestBed.createComponent(IdeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
