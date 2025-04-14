import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:8088/internhub/';
@Injectable({
  providedIn: 'root'
})
export class JwtService {
  constructor(private http: HttpClient) { }
  
  register(data: any): Observable<any> {
    return this.http.post(baseUrl + 'signup', data);
  }

  login(data: any): Observable<any> {
    return this.http.post(baseUrl + 'login', data);
  }
}