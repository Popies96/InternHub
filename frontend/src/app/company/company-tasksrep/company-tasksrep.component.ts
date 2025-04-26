import { Component, OnInit } from '@angular/core';
import { TaskRepService } from '../../../app/services/task-rep.service';
import { TasksService } from '../../../app/services/tasks.service';
import { UserService } from 'src/app/services/user.service';
import { InternshipService } from 'src/app/services/internship.service';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  studentId: number;
  studentName: string;
  student?: Student;
}

interface TaskRep {
  id: number;
  submissionDate: string;
  content: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  feedback?: string;
  fileName?: string;
  fileType?: string;
  task: Task;
}

@Component({
  selector: 'app-company-tasksrep',
  templateUrl: './company-tasksrep.component.html',
  styleUrls: ['./company-tasksrep.component.css']
})
export class CompanyTasksrepComponent implements OnInit {
  taskReps: TaskRep[] = [];
  filteredTaskReps: TaskRep[] = [];
  students: any[] = [];
  internships: any[] = [];
  selectedTaskRep: TaskRep | null = null;
  taskRepToReject: TaskRep | null = null;
  rejectionFeedback: string = '';
  isLoading = true;
  errorMessage: string | null = null;

  // Filters
  searchQuery: string = '';
  selectedStatus: string = 'All Statuses';
  statuses = ['All Statuses', 'PENDING', 'APPROVED', 'REJECTED'];

  constructor(
    private taskRepService: TaskRepService,
    private taskService: TasksService,
    private userService: UserService,
    private internshipService: InternshipService
  ) {}

  ngOnInit(): void {
    this.fetchInitialData();
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
                  this.students.push({
                    id: student.id,
                    firstName: student.prenom,
                    lastName: student.nom,
                    email: student.email,
                    profileImage: student.profileImage
                  });
                  console.log('Student:', student);
                  
                  // When we have all students, load task reps
                  if (this.students.length === studentIds.size) {
                    this.loadTaskRepsWithStudents();
                  }
                },
                error: (error) => {
                  console.error('Error loading student:', error);
                  this.handleError('Error loading student details', error);
                }
              });
            });
          },
          error: (error) => {
            console.error('Error loading internships:', error);
            this.handleError('Error loading internships', error);
          }
        });
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.handleError('Error loading user data', error);
      }
    });
  }

  loadTaskRepsWithStudents(): void {
    this.taskRepService.getAllTaskReps().subscribe({
        next: (taskReps: TaskRep[]) => {
            console.log('Raw task reps from backend:', JSON.stringify(taskReps, null, 2));
            
            this.taskReps = taskReps.map(taskRep => {
                const task = taskRep.task || {};
                
                // Find the matching student from our loaded students array
                const matchingStudent = this.students.find(s => s.id === task.studentId);
                
                if (matchingStudent) {
                    task.student = {
                        id: matchingStudent.id,
                        firstName: matchingStudent.firstName,
                        lastName: matchingStudent.lastName,
                        email: matchingStudent.email,
                        profileImage: matchingStudent.profileImage
                    };
                } else {
                    // If no matching student found, create a default student from task.studentName
                    const [firstName = 'Unknown', lastName = 'Student'] = (task.studentName || '').split(' ');
                    task.student = {
                        id: task.studentId || 0,
                        firstName,
                        lastName,
                        email: '',
                        profileImage: 'https://randomuser.me/api/portraits/lego/1.jpg'
                    };
                }

                return {
                    ...taskRep,
                    task
                };
            });

            console.log('Final processed task reps:', JSON.stringify(this.taskReps, null, 2));
            this.filteredTaskReps = [...this.taskReps];
            this.isLoading = false;
        },
        error: (err) => {
            console.error('Error loading task reps:', err);
            this.handleError('Error loading task submissions', err);
        }
    });
}

  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.errorMessage = message;
    this.isLoading = false;
  }

  applyFilters(): void {
    this.filteredTaskReps = this.taskReps.filter(taskRep => {
      const matchesStatus = this.selectedStatus === 'All Statuses' || 
                          taskRep.status === this.selectedStatus;
      
      const student = taskRep.task.student;
      const studentName = student ? `${student.firstName} ${student.lastName}` : '';
      
      const matchesSearch = this.searchQuery === '' || 
          studentName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          taskRep.task.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  }

  viewSubmissionDetails(taskRep: TaskRep): void {
    this.taskRepService.getTaskRepById(taskRep.id).subscribe({
      next: (detailedTaskRep: TaskRep | null) => {
        this.selectedTaskRep = detailedTaskRep;
      },
      error: (err: any) => {
        console.error('Error loading task rep details:', err);
        this.handleError('Error loading submission details', err);
      }
    });
  }

  approveTaskRep(taskRep: TaskRep): void {
    this.taskRepService.approveTaskRep(taskRep.id).subscribe({
      next: () => {
        taskRep.status = 'APPROVED';
        this.applyFilters();
      },
      error: (err: any) => {
        console.error('Error approving task rep:', err);
        this.handleError('Error approving submission', err);
      }
    });
  }

  openRejectModal(taskRep: TaskRep): void {
    this.taskRepToReject = taskRep;
    this.rejectionFeedback = taskRep.feedback || '';
  }

  confirmReject(): void {
    if (!this.taskRepToReject) return;

    this.taskRepService.rejectTaskRep(
      this.taskRepToReject.id,
      this.rejectionFeedback
    ).subscribe({
      next: () => {
        this.taskRepToReject!.status = 'REJECTED';
        this.taskRepToReject!.feedback = this.rejectionFeedback;
        this.taskRepToReject = null;
        this.applyFilters();
      },
      error: (err: any) => {
        console.error('Error rejecting task rep:', err);
        this.handleError('Error rejecting submission', err);
      }
    });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = 'All Statuses';
    this.applyFilters();
  }

  downloadPdf(taskRepId: number): void {
    this.taskRepService.downloadPdfFile(taskRepId).subscribe({
      next: (blob: Blob | MediaSource) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `submission-${taskRepId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err: any) => {
        console.error('Error downloading PDF:', err);
        this.handleError('Error downloading submission', err);
      }
    });
  }
}