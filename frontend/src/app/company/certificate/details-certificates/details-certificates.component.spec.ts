import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsCertificatesComponent } from './details-certificates.component';



describe('DetailsCertificatesComponent', () => {
  let component: DetailsCertificatesComponent;
  let fixture: ComponentFixture<DetailsCertificatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsCertificatesComponent]
    });
    fixture = TestBed.createComponent(DetailsCertificatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
