// details-certificates.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CertificateService } from 'src/app/services/certificate.service';

@Component({
  selector: 'app-details-certificates',
  templateUrl: './details-certificates.component.html',
  styleUrls: ['./details-certificates.component.css']
})
export class DetailsCertificatesComponent implements OnInit {
navigateToList() {
throw new Error('Method not implemented.');
}
printCertificate() {
throw new Error('Method not implemented.');
}
  certificate: any;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private certificateService: CertificateService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCertificate(+id);
    }
  }

  loadCertificate(id: number): void {
    this.certificateService.getCertificateById(id).subscribe({
      next: (cert) => {
        this.certificate = cert;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading certificate', err);
        this.isLoading = false;
      }
    });
  }
}