import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Certificate } from 'src/app/models/Certificat';
import { CertificateService } from 'src/app/services/certificate.service';

@Component({
  selector: 'app-details-certificates',
  templateUrl: './details-certificates.component.html',
  styleUrls: ['./details-certificates.component.css']
})
export class DetailsCertificatesComponent implements OnInit {
  certificate: Certificate | undefined;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private certificateService: CertificateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCertificate(+id);
    }
  }

  loadCertificate(id: number): void {
    this.certificateService.getCertificateById(id).subscribe({
      next: (data) => {
        this.certificate = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading certificate', err);
        this.isLoading = false;
      }
    });
  }

  navigateToList(): void {
    this.router.navigate(['/certificates']);
  }

  printCertificate(): void {
    window.print();
  }
}