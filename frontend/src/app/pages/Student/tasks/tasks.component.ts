import { Component, OnInit } from '@angular/core';
import { TaskRepService } from 'src/app/services/task-rep.service';
import { TasksService } from 'src/app/services/tasks.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  currentUserId: number | null = null;
  tasks: any[] = [];
  filteredTasks: any[] = [];
  student: any = null;
  isLoading = true;
  error: string | null = null;
  searchQuery: string = '';
  expandedTaskId: number | null = null;

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

      badgeClass: 'bg-blue-100 text-blue-800',
    },
    PDF: {
      display: 'DOCUMENT',

      badgeClass: 'bg-purple-100 text-purple-800',
    },
    TEXT: {
      display: 'TEXT',

      badgeClass: 'bg-green-100 text-green-800',
    },
  };

  // Status configuration
  statusTypes = {
    PENDING: {
      display: 'Pending',
      badgeClass: 'bg-yellow-100 text-yellow-800',
    },
    IN_PROGRESS: {
      display: 'In Progress',
      badgeClass: 'bg-blue-100 text-blue-800',
    },
    COMPLETED: {
      display: 'Completed',
      badgeClass: 'bg-green-100 text-green-800',
    },
    OVERDUE: {
      display: 'Overdue',
      badgeClass: 'bg-red-100 text-red-800',
    },
  };

  constructor(
    private userService: UserService,
    private tasksService: TasksService,
    private taskRepService: TaskRepService
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
          profileImage:
            user.profileImage ||
            'https://randomuser.me/api/portraits/lego/1.jpg',
        };

        this.tasksService.getTasksByStudent(user.id).subscribe({
          next: (tasks) => {
            this.tasks = tasks.map((task: any) => ({
              ...task,
              typeDisplay: this.getTaskTypeDisplay(task.type),
              typeClass: this.getTaskTypeClass(task.type),
              statusDisplay: this.getStatusDisplay(task.status),
              statusClass: this.getStatusClass(task.status),
              submissionContent: '',
              submissionFile: null,
              isSubmitting: false,
            }));
            this.filteredTasks = [...this.tasks];
            this.isLoading = false;
          },
          error: (err) => {
            this.error = 'Failed to load tasks';
            this.isLoading = false;
            console.error('Error loading tasks:', err);
          },
        });
      },
      error: (err) => {
        this.error = 'Failed to load user data';
        this.isLoading = false;
        console.error('Error loading user:', err);
      },
    });
  }

  toggleTaskExpand(taskId: number): void {
    this.expandedTaskId = this.expandedTaskId === taskId ? null : taskId;
  }

  onFileSelected(event: any, task: any): void {
    const file: File = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        this.error = 'Only PDF files are allowed';
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        this.error = 'File size must be less than 10MB';
        return;
      }
      task.submissionFile = file;
      this.error = null;
    }
  }

  submitTask(task: any): void {
    if (!this.currentUserId) {
      this.error = 'User not identified';
      return;
    }
    if (task.type === 'CODE' || task.type === 'TEXT') {
      if (
        !task.submissionContent ||
        task.submissionContent.trim().length === 0
      ) {
        this.error = 'Submission content cannot be empty';
        return;
      }
    } else if (task.type === 'PDF' && !task.submissionFile) {
      this.error = 'Please select a PDF file to upload';
      return;
    }

    task.isSubmitting = true;
    this.error = null;

    if (task.type === 'PDF') {
      this.submitPdfTask(task);
      
    } else {
      this.submitRegularTask(task.id, task);
     
    }
  }

  updateTaskStatus(id: number): void {
    this.tasksService.updateTaskStatus(id).subscribe({
      error: (err: any) => {
        console.error('Error updateing:', err);
      },
    });
  }

  private submitPdfTask(task: any): void {
    this.taskRepService
      .uploadPdfTaskRep(task.id, task.submissionFile)
      .subscribe({
        next: (response) => this.handleSubmissionSuccess(task, response),
        error: (err) => this.handleSubmissionError(task, err),
      });
  }

  private submitRegularTask(taskId: number, task: any): void {
    const submissionData = {
      studentId: this.currentUserId, // will be null if undefined
      content: task.submissionContent,
    };

    this.taskRepService.submitTaskRep(taskId, submissionData).subscribe({
      next: (response) => this.handleSubmissionSuccess(task, response),
    });
  }

  private handleSubmissionSuccess(task: any, response: any): void {
    // Update task status in UI
    const updatedTask = {
      ...task,
      status: 'COMPLETED',
      statusDisplay: this.getStatusDisplay('COMPLETED'),
      statusClass: this.getStatusClass('COMPLETED'),
      isSubmitting: false,
    };

    this.tasks = this.tasks.map((t) => (t.id === task.id ? updatedTask : t));
    this.filteredTasks = this.filteredTasks.map((t) =>
      t.id === task.id ? updatedTask : t
    );
    this.expandedTaskId = null;
  }

  private handleSubmissionError(task: any, err: any): void {
    this.error = err.error?.message || 'Failed to submit task';
    task.isSubmitting = false;
    console.error('Error submitting task:', err);
  }

  // Task type helpers
  getTaskTypeDisplay(type: string): string {
    return (
      this.taskTypes[type as keyof typeof this.taskTypes]?.display || 'UNKNOWN'
    );
  }

  getTaskTypeClass(type: string): string {
    return (
      this.taskTypes[type as keyof typeof this.taskTypes]?.badgeClass ||
      'bg-gray-100 text-gray-800'
    );
  }

  // Status helpers
  getStatusDisplay(status: string): string {
    return (
      this.statusTypes[status as keyof typeof this.statusTypes]?.display ||
      status
    );
  }

  getStatusClass(status: string): string {
    return (
      this.statusTypes[status as keyof typeof this.statusTypes]?.badgeClass ||
      'bg-gray-100 text-gray-800'
    );
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

  // Filter tasks based on search query and selected filters
  applyFilters(): void {
    this.filteredTasks = this.tasks.filter((task) => {
      const matchesSearch =
        !this.searchQuery ||
        task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesStatus =
        this.selectedStatus === 'ALL' || task.status === this.selectedStatus;

      const matchesType =
        this.selectedType === 'ALL' || task.type === this.selectedType;

      return matchesSearch && matchesStatus && matchesType;
    });
  }

  // In your component class
  isChatOpen: boolean = false;

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  isDragOver = false;

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent, task: any) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const fileInputEvent = {
        target: {
          files: event.dataTransfer.files,
        },
      };
      this.onFileSelected(fileInputEvent as any, task);
    }
  }
}
