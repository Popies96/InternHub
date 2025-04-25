import { Component, OnInit } from '@angular/core';
import { Certificate } from 'src/app/models/Certificat';
import { CertificateService } from 'src/app/services/certificate.service';

@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.css']
})
export class CertificatesComponent implements OnInit {
  certificates: Certificate[] = [];
  filteredCertificates: Certificate[] = [];
  searchTerm: string = '';
  sortOrder: string = 'newest'; 

  constructor(private certificateService: CertificateService) { }

  ngOnInit(): void {
    this.loadCertificates();
  }

  loadCertificates(): void {
    this.certificateService.getAllCertificatesForAuthenticatedIssuer().subscribe({
      next: (data) => {
        this.certificates = data;
        this.sortCertificates(); 
        this.filterCertificates();
      },
      error: (err) => console.error('Error loading certificates', err)
    });
  }

  sortCertificates(): void {
    if (this.sortOrder === 'newest') {
      this.certificates.sort((a, b) => 
        new Date(b.issueDate!).getTime() - new Date(a.issueDate!).getTime()
      );
    } else {
      this.certificates.sort((a, b) => 
        new Date(a.issueDate!).getTime() - new Date(b.issueDate!).getTime()
      );
    }
    this.filterCertificates(); 
  }

  filterCertificates(): void {
    if (!this.searchTerm) {
      this.filteredCertificates = [...this.certificates];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredCertificates = this.certificates.filter(cert =>
      cert.title?.toLowerCase().includes(term) ||
      cert.verificationID?.toLowerCase().includes(term) ||
      (cert.studentFirstName && cert.studentFirstName.toLowerCase().includes(term)) ||
      (cert.studentLastName && cert.studentLastName.toLowerCase().includes(term)) ||
      (cert.internshipTitle && cert.internshipTitle.toLowerCase().includes(term)) ||
      (cert.issuerCompanyName && cert.issuerCompanyName.toLowerCase().includes(term)) );
  }

  deleteCertificate(id: number): void {
    if (confirm('Are you sure you want to delete this certificate?')) {
      this.certificateService.deleteCertificate(id).subscribe({
        next: () => {
          this.certificates = this.certificates.filter(c => c.id !== id);
          this.filteredCertificates = this.filteredCertificates.filter(c => c.id !== id);
        },
        error: (err) => console.error('Error deleting certificate', err)
      });
    }
  }
}