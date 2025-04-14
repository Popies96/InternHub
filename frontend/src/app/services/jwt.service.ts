import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:8088/internhub/';
@Injectable({
  providedIn: 'root',
})
export class JwtService {
  constructor(private http: HttpClient) {}

  loginWithOAuth() {
    window.location.href = baseUrl + 'google';
  }
  completeOnboarding(userData: any): Observable<any> {
     const headers = this.createAuthorizedHeader();
     if (headers) {
      return this.http.post(baseUrl + 'update', userData, { headers });
     } else {
       throw new Error('Authorization header creation failed');
     }
    
  }

  register(data: any): Observable<any> {
    return this.http.post(baseUrl + 'signup', data);
  }
  login(data: any): Observable<any> {
    return this.http.post(baseUrl + 'login', data);
  }
  sendVerificationCode(identifier: string, method: String): Observable<string> {
    return this.http.post<string>(baseUrl + 'forgotPassword/request', {
      identifier,
      method,
    });
  }
  verifyCode(identifier: string, validationCode: string): Observable<any> {
    const body = {
      identifier: identifier,
      validationCode: validationCode,
    };
    return this.http.post<any>(baseUrl + 'forgotPassword/validate', body);
  }

  resetPassword(identifier: string, newPassword: string): Observable<string> {
    return this.http.post<string>(baseUrl + 'forgotPassword/reset', {
      identifier,
      newPassword,
    });
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
