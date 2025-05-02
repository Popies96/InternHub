import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddInternshipService } from 'src/app/services/add-internship.service';

@Component({
  selector: 'app-company-internships',
  templateUrl: './company-internships.component.html',
  styleUrls: ['./company-internships.component.css'],
})
export class CompanyInternshipsComponent implements OnInit {
  internships: any[] = [];
  loading = true;
  error = '';
  currentPage = 1;
  itemsPerPage = 10;

  constructor(
    private AddInternshipService: AddInternshipService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadInternships();
  }

  loadInternships(): void {
    this.loading = true;
    this.AddInternshipService.getEnterpriseInternships().subscribe(
      (data) => {
        this.internships = data;
        this.loading = false;
      },
      (error) => {
        this.error = 'Failed to load internships';
        this.loading = false;
        console.error('Error loading internships:', error);
      }
    );
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.internships.length) {
      this.currentPage++;
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  editInternship(id: number): void {
    this.router.navigate(['/company/edit-internship', id]);
  }

  deleteInternship(id: number): void {
    if (confirm('Are you sure you want to delete this internship?')) {
      this.AddInternshipService.deleteInternship(id).subscribe(
        () => {
          alert('Internship deleted successfully');
          this.loadInternships();
        },
        (error: any) => {
          alert('Failed to delete internship');
          console.error('Error deleting internship:', error);
        }
      );
    }
  }
}
