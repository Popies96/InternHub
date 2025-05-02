import { Component, OnInit } from '@angular/core';
import { log } from '@tensorflow/tfjs-core/dist/log';
import { AddInternshipService } from 'src/app/services/add-internship.service';



@Component({
  selector: 'app-internships',
  templateUrl: './internships.component.html',
  styleUrls: ['./internships.component.css'],
})
export class InternshipsComponent implements OnInit {
  internships: any;
  loading!: boolean;
  error!: string;

  constructor(private internshipService: AddInternshipService) {}
  ngOnInit(): void {
    this.loadInternships();
  }
  loadInternships(): void {
    this.loading = true;
    this.internshipService.getAllInterships().subscribe(
      (data: any) => {
        this.internships = data;
        log('Internships loaded:', this.internships);
        this.loading = false;
      },
      (error: any) => {
        this.error = 'Failed to load internships';
        this.loading = false;
        console.error('Error loading internships:', error);
      }
    );
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;

    if (this.isDropdownOpen) {
      setTimeout(() => {
        document.addEventListener('click', this.closeDropdownOutside);
      });
    }
  }

  isDropdownOpen = false;

  private closeDropdownOutside = (event: MouseEvent) => {
    const dropdown = document.getElementById('dropdown');
    const trigger = document.querySelector('[data-dropdown-trigger]');

    const clickedInside =
      dropdown?.contains(event.target as Node) ||
      trigger?.contains(event.target as Node);

    if (!clickedInside) {
      this.isDropdownOpen = false;
      dropdown?.classList.add('hidden');
      document.removeEventListener('click', this.closeDropdownOutside);
    }
  };
}
