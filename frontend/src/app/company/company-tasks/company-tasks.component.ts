import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TasksService } from 'src/app/services/tasks.service';
@Component({
  selector: 'app-company-tasks',
  templateUrl: './company-tasks.component.html',
  styleUrls: ['./company-tasks.component.css']
})
export class CompanyTasksComponent {

  constructor(private fb: FormBuilder ,private  tasksService: TasksService) {
    this.createForm();
  }
  taskForm!: FormGroup;
  isInt = false;
  isStatus = false;
  isDepart = false;
  
  showTaskModal = false;
  isAddTask = false;
  currentTaskId: number | null = null;
  
  interns: { [key: number]: { expanded: boolean } } = {
    1: { expanded: false },
    2: { expanded: false },
    3: { expanded: false }
  };

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
  
  createForm() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      project: ['', Validators.required],
      status: ['Pending', Validators.required],
      dueDate: ['', Validators.required],
      priority: ['Medium', Validators.required],
      assignee: ['', Validators.required]
    });
  }
  toggleDepart() {
    this.isDepart = !this.isDepart;
    this.isInt = false;
    this.isStatus = false;
  }

  toggleIntern(id: number) {
    this.interns[id].expanded = !this.interns[id].expanded;
  }

  openAddTaskModal(internId?: number) {
    this.isAddTask = false;
    this.currentTaskId = internId || null;
    this.showTaskModal = true;
  }

  openEditTaskModal(taskId: number) {
    this.isAddTask = true;
    this.currentTaskId = taskId;
    this.showTaskModal = true;
    // Here you would load the task data into the form
  }

  saveTask() {
    if (this.taskForm.valid) {
      const taskData = {
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        project: this.taskForm.value.project,
        status: this.taskForm.value.status,
        dueDate: this.taskForm.value.dueDate,
        priority: this.taskForm.value.priority,
        assignee: this.taskForm.value.assignee
      };
  
      if (this.taskForm.valid) {
        this.tasksService.addTask(taskData).subscribe(
          (response) => {
            console.log('Task added successfully', response);
          },
          (error) => {
            console.error('Error adding task', error);
          }
        )
      } else {
        // Call your add service
        // this.tasksService.addTask(taskData).subscribe(...);
      }
    }
    this.closeTaskModal();
  }

  deleteTask(taskId: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      console.log('Deleting task', taskId);
    }
  }

  closeTaskModal() {
    this.showTaskModal = false;
    this.isAddTask = false;
    this.currentTaskId = null;
  }
}
