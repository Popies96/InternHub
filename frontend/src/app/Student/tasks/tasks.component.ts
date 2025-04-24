import { Component, OnInit } from '@angular/core';
import { TasksService } from 'src/app/services/tasks.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  currentUserId: number | null = null;
  tasks: any[] = [];
  filteredTasks: any[] = [];
  student: any = null;
  isLoading = true;
  error: string | null = null;
  searchQuery: string = '';
  
  // Filter controls
  selectedType: string = 'ALL';
  selectedTypeDisplay: string = 'All Types';
  selectedStatus: string = 'ALL';
  selectedStatusDisplay: string = 'All Statuses';
  isType = false;
  isStatus = false;

  // Task type configuration
  taskTypes = {
    CODE: {
      display: 'CODING',
      icon: '💻',
      badgeClass: 'bg-blue-100 text-blue-800'
    },
    PDF: {
      display: 'DOCUMENT',
      icon: '📄',
      badgeClass: 'bg-purple-100 text-purple-800'
    },
    TEXT: {
      display: 'TEXT',
      icon: '✏️',
      badgeClass: 'bg-green-100 text-green-800'
    }
  };

  // Status configuration
  statusTypes = {
    PENDING: {
      display: 'Pending',
      badgeClass: 'bg-yellow-100 text-yellow-800'
    },
    IN_PROGRESS: {
      display: 'In Progress',
      badgeClass: 'bg-blue-100 text-blue-800'
    },
    COMPLETED: {
      display: 'Completed',
      badgeClass: 'bg-green-100 text-green-800'
    },
    OVERDUE: {
      display: 'Overdue',
      badgeClass: 'bg-red-100 text-red-800'
    }
  };

  constructor(
    private userService: UserService,
    private tasksService: TasksService
  ) {}

  ngOnInit(): void {
    this.fetchStudentTasks();
  }

  private fetchStudentTasks(): void {
    this.userService.getUserFromLocalStorage().subscribe({
      next: (user) => {
        this.currentUserId = user.id;
        this.student = {
          id: user.id,
          firstName: user.prenom,
          lastName: user.nom,
          profileImage: user.profileImage || 'https://randomuser.me/api/portraits/lego/1.jpg'
        };

        this.tasksService.getTasksByStudent(user.id).subscribe({
          next: (tasks) => {
            this.tasks = tasks.map((task: { type: string; status: string; }) => ({
              ...task,
              typeDisplay: this.getTaskTypeDisplay(task.type),
              typeIcon: this.getTaskTypeIcon(task.type),
              typeClass: this.getTaskTypeClass(task.type),
              statusDisplay: this.getStatusDisplay(task.status),
              statusClass: this.getStatusClass(task.status)
            }));
            this.filteredTasks = [...this.tasks];
            this.isLoading = false;
          },
          error: (err) => {
            this.error = 'Failed to load tasks';
            this.isLoading = false;
            console.error('Error loading tasks:', err);
          }
        });
      },
      error: (err) => {
        this.error = 'Failed to load user data';
        this.isLoading = false;
        console.error('Error loading user:', err);
      }
    });
  }

  // Filter tasks based on search query and selected filters
  applyFilters(): void {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesSearch = !this.searchQuery || 
        task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesStatus = this.selectedStatus === 'ALL' || 
        task.status === this.selectedStatus;
      
      const matchesType = this.selectedType === 'ALL' || 
        task.type === this.selectedType;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }

  // Task type helpers
  getTaskTypeDisplay(type: string): string {
    return this.taskTypes[type as keyof typeof this.taskTypes]?.display || 'UNKNOWN';
  }

  getTaskTypeIcon(type: string): string {
    return this.taskTypes[type as keyof typeof this.taskTypes]?.icon || '❓';
  }

  getTaskTypeClass(type: string): string {
    return this.taskTypes[type as keyof typeof this.taskTypes]?.badgeClass || 'bg-gray-100 text-gray-800';
  }

  // Status helpers
  getStatusDisplay(status: string): string {
    return this.statusTypes[status as keyof typeof this.statusTypes]?.display || status;
  }

  getStatusClass(status: string): string {
    return this.statusTypes[status as keyof typeof this.statusTypes]?.badgeClass || 'bg-gray-100 text-gray-800';
  }

  // Dropdown toggle methods
  toggleType(): void {
    this.isType = !this.isType;
    if (this.isType) this.isStatus = false;
  }

  toggleStatus(): void {
    this.isStatus = !this.isStatus;
    if (this.isStatus) this.isType = false;
  }

  // Filter selection methods
  selectType(type: string, display: string): void {
    this.selectedType = type;
    this.selectedTypeDisplay = display;
    this.isType = false;
    this.applyFilters();
  }

  selectStatus(status: string, display: string): void {
    this.selectedStatus = status;
    this.selectedStatusDisplay = display;
    this.isStatus = false;
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedType = 'ALL';
    this.selectedTypeDisplay = 'All Types';
    this.selectedStatus = 'ALL';
    this.selectedStatusDisplay = 'All Statuses';
    this.applyFilters();
  }
}