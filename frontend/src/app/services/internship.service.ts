import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
const baseUrl = 'http://localhost:8088/internhub/internship/';
@Injectable({
  providedIn: 'root',
})
export class InternshipService {
  constructor(private http: HttpClient) {}

  getInternshipByEnterprise(): Observable<any> {
    const headers = this.createAuthorizedHeader();
    if (headers) {
      return this.http.get(baseUrl + 'enterprise', { headers });
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
}
