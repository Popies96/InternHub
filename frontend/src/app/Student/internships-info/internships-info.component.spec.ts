import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipsInfoComponent } from './internships-info.component';

describe('InternshipsInfoComponent', () => {
  let component: InternshipsInfoComponent;
  let fixture: ComponentFixture<InternshipsInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InternshipsInfoComponent]
    });
    fixture = TestBed.createComponent(InternshipsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
