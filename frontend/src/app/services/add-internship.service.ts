import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
const apiUrl = 'http://localhost:8088/internhub/test';
@Injectable({
  providedIn: 'root',
})
export class AddInternshipService {
  // Define the base API URL
  // Your Spring Boot API URL

  constructor(private http: HttpClient, private router: Router) {}

  // Method to create an internship
  createInternship(internshipData: any): Observable<any> {
    const headers = this.createAuthorizedHeader();
    if (headers) {
      return this.http.post<any>(`${apiUrl}/create`, internshipData, {
        headers,
      });
    } else {
      throw new Error('Authorization header creation failed');
    }
  }

  // Method to get internships for the current enterprise
  getEnterpriseInternships(): Observable<any[]> {
    const headers = this.createAuthorizedHeader();
    if (headers) {
      return this.http.get<any[]>(
        `http://localhost:8088/internhub/internship/enterprise`,
        { headers }
      );
    } else {
      throw new Error('Authorization header creation failed');
    }
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

  deleteInternship(id: number): Observable<any> {
    const headers = this.createAuthorizedHeader();
    if (headers) {
      return this.http.delete(`${apiUrl}/delete/${id}`, { headers });
    } else {
      throw new Error('Authorization header creation failed');
    }
  }

  // Add this method to your existing service
  getInternshipById(id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    });

    return this.http.get<any>(
      `http://localhost:8088/internhub/test/get/${id}`,
      { headers }
    );
  }

  updateInternship(id: number, internshipData: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    });

    return this.http.put<any>(
      `${apiUrl}/update/${id}`, // Make sure this matches your backend endpoint
      internshipData,
      { headers }
    );
  }

  getAllInterships(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8088/internhub/test/all');
  }
}
