import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:8088/internhub/tasks';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  constructor(private http: HttpClient) {}

 
  getAllTasks(): Observable<any> {
    const headers = this.createAuthorizedHeader();
    if (!headers) {
      throw new Error('No authorization token available');
    }
    return this.http.get(baseUrl, {headers});
  }


  getTasksByStudent(studentId: number): Observable<any> {
    const headers = this.createAuthorizedHeader();
    if (!headers) {
      throw new Error('No authorization token available');
    }
    return this.http.get(`${baseUrl}/student/${studentId}`, { headers });
  }

  addTask(taskRequest: any): Observable<any> {
    const headers = this.createAuthorizedHeader();
    if (!headers) {
      throw new Error('No authorization token available');
    }
    return this.http.post(`${baseUrl}/enterprise`, taskRequest, { headers });
  }

 
  updateTask(id: number, taskRequest: any): Observable<any> {
    const headers = this.createAuthorizedHeader();
    if (!headers) {
      throw new Error('No authorization token available');
    }
    return this.http.put(`${baseUrl}/enterprise/${id}`, taskRequest, { headers});
  }


  updateTaskStatus(id: number): Observable<any> {
    const headers = this.createAuthorizedHeader();
    if (!headers) {
      throw new Error('No authorization token available');
    }
    return this.http.put(`${baseUrl}/enterprise/update/${id}`, { headers});
  }



  deleteTask(id: number): Observable<any> {
    const headers = this.createAuthorizedHeader();
    if (!headers) {
      throw new Error('No authorization token available');
    }
    return this.http.delete(`${baseUrl}/enterprise/${id}`, { headers});
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
}