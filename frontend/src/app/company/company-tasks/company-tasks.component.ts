import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-company-tasks',
  templateUrl: './company-tasks.component.html',
  styleUrls: ['./company-tasks.component.css']
})
export class CompanyTasksComponent implements OnInit {

  
  // Static lists (as requested)
  internships: any[] = [
    {
      id: 1,
      title: 'Frontend Developer Internship',
      description: 'Work with Angular and help build UI components.',
      location: 'Remote',
      durationInMonths: 3,
      startDate: '2025-06-01',
      endDate: '2025-09-01',
      status: 'OPEN'
    },
    {
      id: 2,
      title: 'Backend Developer Internship',
      description: 'Build REST APIs with Spring Boot.',
      location: 'New York',
      durationInMonths: 6,
      startDate: '2025-05-15',
      endDate: '2025-11-15',
      status: 'IN_PROGRESS'
    },
    {
      id: 3,
      title: 'UI/UX Design Internship',
      description: 'Assist in creating user-friendly interfaces.',
      location: 'San Francisco',
      durationInMonths: 4,
      startDate: '2025-07-01',
      endDate: '2025-11-01',
      status: 'CLOSED'
    }
  ];

  students: any[] = [
    {
      id: 3,
      nom: 'Smith',
      prenom: 'John',
      password: 'hashed-password',
      email: 'john.smith@example.com',
      phone: 1234567890,
      role: 'STUDENT',
      cin: 987654321,
      school: 'MIT'
    },
    {
      id: 102,
      nom: 'Doe',
      prenom: 'Jane',
      password: 'hashed-password',
      email: 'jane.doe@example.com',
      phone: 1122334455,
      role: 'STUDENT',
      cin: 123456789,
      school: 'Stanford University'
    },
    {
      id: 103,
      nom: 'Ali',
      prenom: 'Yasmine',
      password: 'hashed-password',
      email: 'yasmine.ali@example.com',
      phone: 9988776655,
      role: 'STUDENT',
      cin: 456789123,
      school: 'Harvard'
    }
  ];

  // Dynamic task data
  tasks: any[] = [];
  interns: any[] = [];
  expandedInterns: { [key: number]: boolean } = {};

  // Form and UI state
  taskForm!: FormGroup;
  isInt = false;
  isStatus = false;
  isDepart = false;
  showAddModal = false;
  showUpdateModal = false;
  currentTaskId: number | null = null;

  constructor(private fb: FormBuilder, private tasksService: TasksService) {
    this.createForm();
  }

  ngOnInit(): void {
    this.fetchTasks();
  }


  private createAuthorizedHeader(): HttpHeaders | null {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    } else {
      console.log('No token found');
      return null;
    }
  }

  createForm() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      deadline: ['', Validators.required],
      status: ['PENDING', Validators.required],
      internshipId: ['', Validators.required],
      studentId: ['', Validators.required]
    });
  }

  fetchTasks() {
    this.tasksService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.groupTasksByIntern();
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
      }
    });
  }

  groupTasksByIntern() {
    const internsMap = new Map<number, any>();
    
    this.tasks.forEach(task => {
      if (!internsMap.has(task.studentId)) {
        const student = this.students.find(s => s.id === task.studentId) || {
          id: task.studentId,
          nom: 'Unknown',
          prenom: 'Student'
        };
        
        internsMap.set(task.studentId, {
          id: student.id,
          firstName: student.prenom,
          lastName: student.nom,
          profileImage: 'https://randomuser.me/api/portraits/lego/1.jpg',
          position: this.getInternshipTitle(task.internshipId),
          status: 'ACTIVE',
          internshipProgram: this.getInternshipTitle(task.internshipId),
          tasks: []
        });
      }
      internsMap.get(task.studentId).tasks.push(task);
    });

    this.interns = Array.from(internsMap.values());
    this.interns.forEach(intern => {
      this.expandedInterns[intern.id] = false;
    });
  }

  getInternshipTitle(internshipId: number): string {
    const internship = this.internships.find(i => i.id === internshipId);
    return internship ? internship.title : 'Unknown Internship';
  }

  getStudentName(studentId: number): string {
    const student = this.students.find(s => s.id === studentId);
    return student ? `${student.prenom} ${student.nom}` : 'Unknown Student';
  }

  toggleInt() {
    this.isInt = !this.isInt;
    this.isStatus = false;
    this.isDepart = false;
  }

  toggleStatus() {
    this.isStatus = !this.isStatus;
    this.isInt = false;
    this.isDepart = false;
  }

  toggleDepart() {
    this.isDepart = !this.isDepart;
    this.isInt = false;
    this.isStatus = false;
  }

  toggleIntern(internId: number) {
    this.expandedInterns[internId] = !this.expandedInterns[internId];
  }



// company-tasks.component.ts
addTask() {
  if (this.taskForm.invalid) {
    this.taskForm.markAllAsTouched();
    return;
  }

  // In your component
function formatDeadline(deadline: Date | string): string {
  let date: Date;
  
  if (deadline instanceof Date) {
    date = deadline;
  } else {
    date = new Date(deadline);
  }
  
  // Format as ISO string without milliseconds
  return date.toISOString().split('.')[0];
}
 
  const taskRequest = {
    title: this.taskForm.value.title,
    description: this.taskForm.value.description,
    deadline: formatDeadline(this.taskForm.value.deadline),
    status: this.taskForm.value.status,
    internshipId: this.taskForm.value.internshipId, // Changed from nested object
    studentId: this.taskForm.value.studentId       // Changed from nested object
  };

  console.log('Task Request:', taskRequest);

  this.tasksService.addTask(taskRequest).subscribe({
    next: () => {
      this.closeAddModal();
      this.fetchTasks();
      alert('Task added successfully!');
    },
    error: (error) => {
      console.error('Error adding task:', error);
      if (error.status === 403) {
        alert('You do not have permission to perform this action. Please log in again.');
      } else {
        alert('Failed to add task. Please try again.');
      }
    }
  });
}

  updateTask() {
    if (this.taskForm.invalid || !this.currentTaskId) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const taskData = this.taskForm.value;
    this.tasksService.updateTask(this.currentTaskId, taskData).subscribe({
      next: () => {
        this.closeUpdateModal();
        this.fetchTasks();
      },
      error: (error) => {
        console.error('Error updating task:', error);
      }
    });
  }

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
      studentId: task.studentId
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
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}