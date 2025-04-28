import { Component, OnInit } from '@angular/core';
import { TasksService } from 'src/app/services/tasks.service';
import { UserService } from 'src/app/services/user.service';

interface Task {
  id: number;
  title: string;
  description: string;
  deadline: string;
  status: string;
  type: string;
  priority: string;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  currentMonth: Date = new Date();
  calendarDays: Date[] = [];
  userId: number | null = null;
  viewMode: 'day' | 'week' | 'month' = 'month';
  currentFilter: string = 'all';
  selectedTask: Task | null = null;

  constructor(
    private tasksService: TasksService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    this.userService.getUserFromLocalStorage().subscribe({
      next: (user) => {
        this.userId = user.id;
        this.loadTasks();
      },
      error: (err) => console.error('Error fetching user:', err),
    });
  }

  private loadTasks(): void {
    if (this.userId) {
      this.tasksService.getTasksByStudent(this.userId).subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.filterTasks(this.currentFilter);
          this.generateCalendarDays();
        },
        error: (err) => console.error('Error fetching tasks:', err),
      });
    }
  }

  filterTasks(status: string): void {
    this.currentFilter = status;
    if (status === 'all') {
      this.filteredTasks = [...this.tasks];
    } else {
      this.filteredTasks = this.tasks.filter(
        (task) => task.status.toLowerCase() === status.toLowerCase()
      );
    }
  }

  selectTask(task: Task): void {
    this.selectedTask = task;
    // You can add additional functionality here, like showing a modal with task details
    console.log('Selected task:', task);
  }

  private generateCalendarDays(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();

    // Get first day of month
    const firstDay = new Date(year, month, 1);
    // Get last day of month
    const lastDay = new Date(year, month + 1, 0);

    // Get previous month's days to fill first week
    const firstDayIndex = firstDay.getDay();
    const prevMonthDays = new Date(year, month, 0).getDate();

    this.calendarDays = [];

    // Add previous month's days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      this.calendarDays.push(new Date(year, month - 1, prevMonthDays - i));
    }

    // Add current month's days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      this.calendarDays.push(new Date(year, month, i));
    }

    // Add next month's days to complete the grid
    const remainingDays = 42 - this.calendarDays.length; // 6 rows * 7 days = 42
    for (let i = 1; i <= remainingDays; i++) {
      this.calendarDays.push(new Date(year, month + 1, i));
    }
  }

  getTasksForDay(date: Date): Task[] {
    return this.tasks.filter((task) => {
      const taskDate = new Date(task.deadline);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentMonth.getMonth();
  }

  previousMonth(): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1
    );
    this.generateCalendarDays();
  }

  nextMonth(): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1
    );
    this.generateCalendarDays();
  }

  getMonthName(): string {
    return this.currentMonth.toLocaleString('default', { month: 'long' });
  }

  getTaskStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-600';
      case 'in_progress':
        return 'bg-sky-50 text-sky-600';
      case 'pending':
        return 'bg-purple-50 text-purple-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  }

  setViewMode(mode: 'day' | 'week' | 'month'): void {
    this.viewMode = mode;
  }

  getTasksByStatus(status: string): Task[] {
    return this.tasks.filter(
      (task) => task.status.toLowerCase() === status.toLowerCase()
    );
  }

  formatDeadline(deadline: string): string {
    const date = new Date(deadline);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
