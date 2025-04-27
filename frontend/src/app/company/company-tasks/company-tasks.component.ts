import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TasksService } from 'src/app/services/tasks.service';
import { UserService } from 'src/app/services/user.service';
import { InternshipService } from 'src/app/services/internship.service';
import { TaskNotificationService } from 'src/app/services/task-notif.service';

@Component({
  selector: 'app-company-tasks',
  templateUrl: './company-tasks.component.html',
  styleUrls: ['./company-tasks.component.css']
})
export class CompanyTasksComponent implements OnInit {
  // Dynamic data from backend
  internships: any[] = [];
  students: any[] = [];
  tasks: any[] = [];
  interns: any[] = [];
  expandedInterns: { [key: number]: boolean } = {};

  // Form and UI state
  taskForm!: FormGroup;
  isInt = false;
  isStatus = false;
  showAddModal = false;
  showUpdateModal = false;
  currentTaskId: number | null = null;
  

  constructor(
    private fb: FormBuilder,
    private tasksService: TasksService,
    private userService: UserService,
    private internshipService: InternshipService,
    private notificationService: TaskNotificationService 
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.fetchInitialData();

    this.userService.getUserFromLocalStorage().subscribe(user => {
      if (user && user.id) {
        this.notificationService.connect(user.id);
      }
    });
  }


selectedInternship: string = '';
selectedStatus: string = '';
searchQuery: string = '';
filteredInterns: any[] = [];

// Add these methods to your component class
selectInternship(internship: string) {
  this.selectedInternship = internship === 'All Internships' ? '' : internship;
  this.isInt = false;
  this.applyFilters();
}

selectStatus(status: string) {
  this.selectedStatus = status === 'All Statuses' ? '' : status;
  this.isStatus = false;
  this.applyFilters();
}


applyFilters() {
  this.filteredInterns = this.interns.filter(intern => {
    // Filter by internship program
    const internshipMatch = !this.selectedInternship || 
      intern.internshipProgram === this.selectedInternship;
    
    // Filter by task status (if intern has tasks)
    const statusMatch = !this.selectedStatus || 
      intern.tasks.some((task: any) => task.status === this.selectedStatus);

    const searchMatch = !this.searchQuery || 
      `${intern.firstName} ${intern.lastName}`.toLowerCase().includes(this.searchQuery.toLowerCase());

      
    
    return internshipMatch && statusMatch &&  searchMatch;
  });
}

clearFilters() {
  this.selectedInternship = '';
  this.selectedStatus = '';
  this.searchQuery = '';
  this.filteredInterns = [...this.interns];
}

  private fetchInitialData() {
    this.userService.getUserFromLocalStorage().subscribe({
      next: (user) => {
        // Get internships for this enterprise
        this.internshipService.getInternshipByEnterprise().subscribe({
          next: (internships: any) => {
            this.internships = internships;
            console.log('Internships:', this.internships);
            
            const studentIds = new Set<number>();
            this.internships.forEach(internship => {
              if (internship.studentId) {
                console.log('Student ID:', internship.studentId);
                studentIds.add(internship.studentId);
              }
            });

            // Load student details
            studentIds.forEach(id => {
              this.userService.getUserById(id).subscribe({
                next: (student) => {
                  this.students.push(student);
                  console.log('Student:', student);
                  // When we have students, load tasks
                  if (this.students.length === studentIds.size) {
                    this.fetchTasks();
                  }
                },
                error: (error) => {
                  console.error('Error loading student:', error);
                }
              });
            });
          },
          error: (error) => {
            console.error('Error loading internships:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error loading user:', error);
      }
    });
  }

  fetchTasks() {
    this.tasksService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks.filter((task: any) => 
          this.internships.some(internship => internship.id === task.internshipId)
        );
        this.groupTasksByIntern();
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
      }
    });
  }

  groupTasksByIntern() {
    const internsMap = new Map<number, any>();
  
    // First, create entries for all students (even those without tasks)
    this.students.forEach(student => {
      internsMap.set(student.id, {
        id: student.id,
        firstName: student.prenom,
        lastName: student.nom,
        profileImage: 'https://randomuser.me/api/portraits/lego/1.jpg',
        position: this.getStudentPosition(student.id),
        status: 'ACTIVE',
        internshipProgram: this.getStudentInternship(student.id),
        tasks: [] 
      });
    });
  
    
    this.tasks.forEach(task => {
      if (internsMap.has(task.studentId)) {
        internsMap.get(task.studentId).tasks.push(task);
      }
    });
  
    this.interns = Array.from(internsMap.values());
    this.filteredInterns = [...this.interns]; 
    this.interns.forEach(intern => {
      this.expandedInterns[intern.id] = false;
    });
  }
  
  private getStudentPosition(studentId: number): string {
    const internship = this.internships.find(i => i.studentId === studentId);
    return internship ? internship.title : 'Intern';
  }
  
  // Helper method to get student's internship program
  private getStudentInternship(studentId: number): string {
    const internship = this.internships.find(i => i.studentId === studentId);
    return internship ? internship.title : 'General Internship';
  }

  getInternshipTitle(internshipId: number): string {
    const internship = this.internships.find(i => i.id === internshipId);
    return internship ? internship.title : 'Unknown Internship';
  }

  getStudentName(studentId: number): string {
    const student = this.students.find(s => s.id === studentId);
    return student ? `${student.prenom} ${student.nom}` : 'Unknown Student';
  }

  // UI toggle methods
  toggleInt() {
    this.isInt = !this.isInt;
    this.isStatus = false;
    
  }

  toggleStatus() {
    this.isStatus = !this.isStatus;
    this.isInt = false;
    
  }

  toggleIntern(internId: number) {
    this.expandedInterns[internId] = !this.expandedInterns[internId];
  }

  // Form methods
  private createForm() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      deadline: ['', Validators.required],
      status: ['PENDING', Validators.required],
      internshipId: ['', Validators.required],
      studentId: ['', Validators.required],
      type: ['PDF', Validators.required],
      priority: ['MEDIUM', Validators.required]
    });
  }

  // Task CRUD operations
  addTask() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }
  
    const taskRequest = {
      title: this.taskForm.value.title,
      description: this.taskForm.value.description,
      deadline: this.formatDeadline(this.taskForm.value.deadline),
      status: this.taskForm.value.status,
      internshipId: this.taskForm.value.internshipId,
      studentId: this.taskForm.value.studentId,
      type: this.taskForm.value.type,
      priority: this.taskForm.value.priority
    };
  
    this.tasksService.addTask(taskRequest).subscribe({
      next: (savedTask) => {
        this.closeAddModal();
        this.fetchTasks();
        
           this.notificationService.sendNotification(

          {
            type: 'TASK_ASSIGNED',
            taskId: savedTask.id,
            studentId: savedTask.studentId,
            title: savedTask.title,
            message: `New task assigned: ${savedTask.title}`,
            timestamp: new Date().toISOString()
          }
        );
        
        alert('Task added successfully!');
      },
      error: (error) => {
        console.error('Error adding task:', error);
        alert(error.status === 403 
          ? 'Permission denied. Please log in again.' 
          : 'Failed to add task. Please try again.');
      }
    });
  }
  ngOnDestroy() {
    this.notificationService.disconnect();
  }
  updateTask() {
    if (this.taskForm.invalid || !this.currentTaskId) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const taskRequest = {
      title: this.taskForm.value.title,
      description: this.taskForm.value.description,
      deadline: this.formatDeadline(this.taskForm.value.deadline),
      status: this.taskForm.value.status,
      internshipId: this.taskForm.value.internshipId,
      studentId: this.taskForm.value.studentId,
      type: this.taskForm.value.type,
      priority: this.taskForm.value.priority
    };

    this.tasksService.updateTask(this.currentTaskId, taskRequest).subscribe({
      next: () => {
        this.closeUpdateModal();
        this.fetchTasks();
      },
      error: (error) => {
        console.error('Error updating task:', error);
      }
    });
  }

  private formatDeadline(deadline: Date | string): string {
    const date = deadline instanceof Date ? deadline : new Date(deadline);
    return date.toISOString().split('.')[0];
  }

  // Modal methods
  openAddTaskModal(internId?: number) {
    this.currentTaskId = null;
    this.showAddModal = true;
    this.taskForm.reset({
      status: 'PENDING',
      studentId: internId || ''
    });
  }

  openEditTaskModal(task: any) {
    this.currentTaskId = task.id;
    this.showUpdateModal = true;
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      deadline: new Date(task.deadline).toISOString().split('T')[0],
      status: task.status,
      internshipId: task.internshipId,
      studentId: task.studentId,
      type: task.type || 'PDF',
      priority: task.priority || 'MEDIUM'
    });
  }

  deleteTask(taskId: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.tasksService.deleteTask(taskId).subscribe({
        next: () => {
          this.fetchTasks();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
        }
      });
    }
  }

  closeAddModal() {
    this.showAddModal = false;
    this.taskForm.reset();
  }

  closeUpdateModal() {
    this.showUpdateModal = false;
    this.currentTaskId = null;
    this.taskForm.reset();
  }

  // UI helper methods
  getStatusColor(status: string): string {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'OVERDUE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'CRITICAL': return 'bg-purple-100 text-purple-800';
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }


  
}