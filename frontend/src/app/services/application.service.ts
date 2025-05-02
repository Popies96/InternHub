import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private baseUrl = 'http://localhost:8088/internhub/application'; // adapt the port if needed

  constructor(private http: HttpClient) {}

  createApplication(formData: FormData): Observable<any> {
    const headers = this.createAuthorizedHeader();

    if (headers) {
      // ⚡️ Don't manually set 'Content-Type' here! Let browser set it for multipart/form-data
      return this.http.post<any>(`${this.baseUrl}/create`, formData, {
        headers,
      });
    } else {
      throw new Error('Authorization header creation failed');
    }
  }

  getAllApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  getApplicationById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/app/${id}`);
  }

  deleteApplication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
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
