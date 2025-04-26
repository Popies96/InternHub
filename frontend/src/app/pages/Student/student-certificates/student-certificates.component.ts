import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Certificate } from 'src/app/models/models ';
import { CertificateService } from 'src/app/services/certificate.service';

@Component({
  selector: 'app-student-certificates',
  templateUrl: './student-certificates.component.html',
  styleUrls: ['./student-certificates.component.css'],
})
export class StudentCertificatesComponent implements OnInit {
  isSidebarCompact = false;
  certificates: Certificate[] = [];
  filteredCertificates: Certificate[] = [];
  searchControl = new FormControl('');
  sortOrder: 'asc' | 'desc' = 'desc';

  constructor(private certificateService: CertificateService) {}

  ngOnInit(): void {
    this.loadCertificates();
    this.setupSearch();
  }

  loadCertificates(): void {
    this.certificateService.getMyCertificates().subscribe({
      next: (data) => {
        this.certificates = data;
        this.filteredCertificates = [...data];
        this.sortCertificates();
      },
      error: (err) => console.error('Failed to load certificates:', err),
    });
  }

  setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.filterCertificates(searchTerm || '');
      });
  }

  filterCertificates(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredCertificates = [...this.certificates];
    } else {
      const term = searchTerm.toLowerCase();
      this.filteredCertificates = this.certificates.filter(
        (cert) =>
          cert.title!.toLowerCase().includes(term) ||
          (cert.internshipTitle! &&
            cert.internshipTitle.toLowerCase().includes(term))
      );
    }
    this.sortCertificates();
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortCertificates();
  }

  sortCertificates(): void {
    this.filteredCertificates.sort((a, b) => {
      const dateA = new Date(a.issueDate!).getTime();
      const dateB = new Date(b.issueDate!).getTime();
      return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }

  onSidebarToggled(isCompact: boolean): void {
    this.isSidebarCompact = isCompact;
  }
}
