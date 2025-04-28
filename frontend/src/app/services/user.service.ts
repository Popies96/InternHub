import { Injectable } from '@angular/core';
import { InternshipAi } from '../models/models ';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
const baseUrl = 'http://localhost:8088/internhub/';
interface TokenPayload {
  email: string}
  export interface User {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    phone: number;
    role: string;
    school: string;
    cin: number;
    companyName: string;
    companyAddress: string;
    internships: any[]; 
    internshipAiList: InternshipAi[];
  }
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUserId: string | null = null;
  private users: User[] = [];
  constructor(private http: HttpClient) {}

  // Use email from token to get user from backend

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(baseUrl + 'user/all');
  }

  getUserFromLocalStorage(): Observable<any> {
    const headers = this.createAuthorizedHeader();
    if (!headers) {
      return throwError(
        () => new Error('Authorization header creation failed')
      );
    }
    const email = localStorage.getItem('email');
    if (!email) {
      return throwError(() => new Error('Email not found in localStorage'));
    }

    return this.http
      .get(`${baseUrl}user/email?email=${email}`, {
        headers,
        responseType: 'json',
      })
      .pipe(
        catchError((err) => {
          console.error('Error fetching user:', err);
          return throwError(() => err);
        })
      );
  }
  updateUser(user: User): Observable<User> {
    const headers = this.createAuthorizedHeader();
    if (!headers) {
      return throwError(
        () => new Error('Authorization header creation failed')
      );
    }
    return this.http.put<User>(`${baseUrl}user/update/`, user, { headers });
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

  // Add this method to your existing UserService
  getUserById(userId: number): Observable<any> {
    const headers = this.createAuthorizedHeader();
    if (!headers) {
      throw new Error('No authorization token available');
    }
    return this.http.get(`${baseUrl}user/${userId}`, {
      headers,
      responseType: 'json',
    });
  }

  getAllStudents(): Observable<any[]> {
    const headers = this.createAuthorizedHeader();
    if (!headers) {
      throw new Error('No authorization token available');
    }
    return this.http.get<any[]>(`${baseUrl}students`, { headers });
  }
}
