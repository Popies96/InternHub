import { Component, OnInit } from '@angular/core';
import { User, UserService } from 'src/app/services/user.service';
// Adjust this if your User model path is different

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  activeTab = 'students';
  searchQuery = '';
  statusFilter = 'all';
  showReportModal = false;
  selectedUser: any = null;
  reportMessage = '';

  students: User[] = [];
  companies: User[] = [];
  filteredStudents: User[] = [];
  filteredCompanies: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        console.log(users);
        
        // Assuming each user has a 'role' field ('student' or 'enterprise')
        this.students = users.filter((user) => user.role === 'STUDENT');
        this.companies = users.filter(
          (user) => user.role === 'ENTERPRISE'
        );

        this.filterUsers();
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }

  filterUsers(): void {
    this.filteredStudents = this.students.filter((student) => {
      const matchesSearch =
        student.nom
          ?.toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
        student.prenom
          ?.toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
        student.email?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        student.school
          ?.toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
        student.cin?.toString().includes(this.searchQuery);

      

      return matchesSearch;
    });

    this.filteredCompanies = this.companies.filter((company) => {
      const matchesSearch =
        company.companyName
          ?.toLowerCase()
          .includes(this.searchQuery.toLowerCase())  ||
        company.email?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        company.companyAddress
          ?.toLowerCase()
          .includes(this.searchQuery.toLowerCase());

     
   

      return matchesSearch
    });
  }

  banUser(userId: number): void {
    const user = [...this.students, ...this.companies].find(
      (u) => u.id === userId
    );
    if (user) {
      // user.status = 'banned';
      this.filterUsers();
      // Optionally call API to update user status
    }
  }

  unbanUser(userId: number): void {
    const user = [...this.students, ...this.companies].find(
      (u) => u.id === userId
    );
    if (user) {
      // user.status = 'active';
      this.filterUsers();
      // Optionally call API to update user status
    }
  }

  openReportModal(user: any): void {
    this.selectedUser = user;
    this.reportMessage = '';
    this.showReportModal = true;
  }

  sendReport(): void {
    if (this.reportMessage.trim()) {
      console.log(
        `Report sent to ${
          this.selectedUser.firstName || this.selectedUser.companyName
        }:`,
        this.reportMessage
      );
      this.showReportModal = false;
    }
  }

  viewDetails(userId: number): void {
    console.log('View details for user:', userId);
  }
}
