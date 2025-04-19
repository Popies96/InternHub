import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:8088/internhub/';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  constructor(
    private http: HttpClient,
  ) { }

  addTask(taskData: any): Observable<any> {
    const headers = this.createAuthorizedHeader();
    if (!headers) {
      throw new Error('No authorization token available');
    }
    return this.http.post(baseUrl + 'enterprise/addTask', taskData, { headers });
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