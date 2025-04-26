
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


const baseUrl = 'http://localhost:8088/internhub/api/task-reps';
@Injectable({
  providedIn: 'root'
})
export class TaskRepService {
 
  constructor(private http: HttpClient) { }

  private createAuthorizedHeader(): HttpHeaders | null {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    } else {
      console.log('No token found');
      return null;
    }
  }
  getAllTaskReps(): Observable<any> {
    const headers = this.createAuthorizedHeader();
    if (!headers) {
      throw new Error('No authorization token available');
    }
    return this.http.get(`${baseUrl}/all`, { headers  , responseType: 'json'});
  }

  submitTaskRep(taskId: number, formData: any): Observable<any> {
    const headers = this.createAuthorizedHeader();
    if (!headers) {
      throw new Error('No authorization token available');
    }
    return this.http.post(`${baseUrl}/tasks/${taskId}/task-rep`, formData , { headers , responseType: 'json'});
  }

  // Upload PDF file for a task
  uploadPdfTaskRep(taskId: number, file: File): Observable<any> {
    const headers = this.createAuthorizedHeader();
    if (!headers) {
      throw new Error('No authorization token available');
    }
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${baseUrl}/${taskId}/pdf`, formData, { headers });
  }

  // Get task response by task ID
  getTaskRepByTaskId(taskId: number): Observable<any> {
    const headers = this.createAuthorizedHeader();
    if (!headers) {
      throw new Error('No authorization token available');
    }
    return this.http.get(`${baseUrl}/task/${taskId}` , { headers });
  }
  getTaskRepById(taskRepId: number): Observable<any> {
    const headers = this.createAuthorizedHeader();
    if (!headers) {
      throw new Error('No authorization token available');
    }
    return this.http.get(`${baseUrl}/${taskRepId}`, { headers });
  }
  // Download PDF file
  downloadPdfFile(taskRepId: number): Observable<any> {
    const headers = this.createAuthorizedHeader();
    if (!headers) {
      throw new Error('No authorization token available');
    }
    return this.http.get(`${baseUrl}/${taskRepId}/pdf`, {
      responseType: 'blob' as 'json' , headers
    });
  }

  approveTaskRep(taskRepId: number): Observable<any> {
    const headers = this.createAuthorizedHeader();
    if (!headers) {
      throw new Error('No authorization token available');
    }
    return this.http.patch(`${baseUrl}/${taskRepId}/approve`, {}, { headers });
  }

  // Reject a task response with feedback
  rejectTaskRep(taskRepId: number, feedback: string): Observable<any> {
    const headers = this.createAuthorizedHeader();
    if (!headers) {
      throw new Error('No authorization token available');
    }
    return this.http.patch(`${baseUrl}/${taskRepId}/reject`, { feedback }, { headers });
  }
}