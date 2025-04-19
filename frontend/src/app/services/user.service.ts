import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
const baseUrl = 'http://localhost:8088/internhub/';
interface TokenPayload {
  email: string;
}
export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  phone: number;
  role: string;
  school: string;
  cin: number;
  internships: any[]; // or a specific type if you have one
  internshipAiList: any[];
}
  @Injectable({
  providedIn: 'root'
})

export class UserService {
  private currentUserId: string | null = null;
  private users: User[] = [];
  constructor(private http:HttpClient) {}



  // Use email from token to get user from backend

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(baseUrl +"user/all");
  }

  getUserFromLocalStorage(): Observable<any> {
    const email = localStorage.getItem('email');
    if (!email) {
      return throwError(() => new Error('Email not found in localStorage'));
    }

    return this.http.get(`${baseUrl}user/email?email=${email}`).pipe(
      catchError(err => {
        console.error('Error fetching user:', err);
        return throwError(() => err);
      })
    );
  }

}