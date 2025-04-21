import { Component, OnInit } from '@angular/core';
import { InternshipAi } from 'src/app/models/models ';
import { InternshipAiService } from 'src/app/services/internship-ai.service';

@Component({
  selector: 'app-internship-ai-list',
  templateUrl: './internship-ai-list.component.html',
  styleUrls: ['./internship-ai-list.component.css'],
})
export class InternshipAiListComponent implements OnInit {
  internships: InternshipAi[] = [];
  filteredInternships: InternshipAi[] = [];
  expandedInternships: { [key: string]: boolean } = {};
  // Modal controls
  showDeleteModal = false;
  internshipToDelete: number | null = null;

  // Filter controls
  searchQuery: string = '';
  selectedCategory: string | null = null;
  selectedStatus: boolean | null = null;
  uniqueCategories: string[] = [];

  // Dropdown states
  isCategoryOpen: boolean = false;
  isStatusOpen: boolean = false;

  constructor(private internshipAiService: InternshipAiService) {}

  ngOnInit() {
    this.loadInternships();
  }

  loadInternships() {
    this.internshipAiService.getInternshipAiList().subscribe((data) => {
      this.internships = data;
      this.filteredInternships = [...this.internships];
      this.uniqueCategories = this.getUniqueCategories();
     
      console.log('Internship AI List:', this.internships);
    });
  }

  // Toggle functions
  toggleInternshipDetails(id: number) {
    this.expandedInternships[id] = !this.expandedInternships[id];
  }

  toggleCategory() {
    this.isCategoryOpen = !this.isCategoryOpen;
    if (this.isCategoryOpen) this.isStatusOpen = false;
  }

  toggleStatus() {
    this.isStatusOpen = !this.isStatusOpen;
    if (this.isStatusOpen) this.isCategoryOpen = false;
  }
  //delete
  openDeleteConfirmation(id: number) {
    this.internshipToDelete = id;
    this.showDeleteModal = true;
  }

  closeDeleteConfirmation() {
    this.showDeleteModal = false;
    this.internshipToDelete = null;
  }

  confirmDelete() {
    if (this.internshipToDelete) {
      this.internshipAiService
        .deleteInternshipAi(this.internshipToDelete)
        .subscribe({
          next: () => {
            this.loadInternships(); 
            this.closeDeleteConfirmation();
          },
          error: (err) => {
            console.error('Error deleting internship:', err);
            this.closeDeleteConfirmation();
          },
        });
    }
  }

  // Filter functions
  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
    this.isCategoryOpen = false;
  }

  filterByStatus(status: boolean) {
    this.selectedStatus = status;
    this.applyFilters();
    this.isStatusOpen = false;
  }

  clearCategoryFilter() {
    this.selectedCategory = null;
    this.applyFilters();
    this.isCategoryOpen = false;
  }

  clearStatusFilter() {
    this.selectedStatus = null;
    this.applyFilters();
    this.isStatusOpen = false;
  }

  applySearch() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredInternships = this.internships.filter((internship) => {
      const matchesSearch =
        !this.searchQuery ||
        internship.title
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
        internship.description
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());

      const matchesCategory =
        !this.selectedCategory || internship.category === this.selectedCategory;

      const matchesStatus =
        this.selectedStatus === null ||
        internship.active === this.selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  // Helper functions
  getUniqueCategories(): string[] {
    const categories = new Set(this.internships.map((i) => i.category));
    return Array.from(categories);
  }

  calculateDuration(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  }

  getSkillsFromDescription(description: string): string[] {
    // This is a simple implementation - you might want to improve it
    const skills = [
      'JavaScript',
      'Python',
      'React',
      'Angular',
      'Node.js',
      'HTML',
      'CSS',
    ];
    return skills;
  }

  // Action functions


 

  toggleInternshipStatus(id: number, newStatus: boolean) {
    // Implement status toggle functionality
    console.log(`Set internship ${id} status to ${newStatus}`);
  }
}
