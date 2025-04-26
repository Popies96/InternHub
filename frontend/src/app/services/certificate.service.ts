
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Certificate } from '../models/models ';
const API_URL = 'http://localhost:8088/internhub/certificates';

@Injectable({
  providedIn: 'root',
})
export class CertificateService {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    return throwError(() => error.error || 'Server error');
  }

  getAllCertificatesForAuthenticatedIssuer(): Observable<Certificate[]> {
    return this.http
      .get<Certificate[]>(API_URL, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getCertificateById(id: number): Observable<Certificate> {
    return this.http
      .get<Certificate>(`${API_URL}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  createCertificate(certificateData: Certificate): Observable<Certificate> {
    return this.http
      .post<Certificate>(API_URL, certificateData, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((response) => console.log('Certificate created:', response)),
        catchError(this.handleError)
      );
  }

  getMyCertificates(): Observable<Certificate[]> {
    return this.http
      .get<Certificate[]>(`${API_URL}/my-certificates`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getCertificateDetails(id: number): Observable<Certificate> {
    return this.http
      .get<Certificate>(`${API_URL}/${id}/details`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  updateCertificate(
    id: number,
    certificate: Certificate
  ): Observable<Certificate> {
    return this.http
      .put<Certificate>(`${API_URL}/${id}`, certificate, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  deleteCertificate(id: number): Observable<void> {
    return this.http
      .delete<void>(`${API_URL}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getAllInternships(): Observable<any[]> {
    return this.http
      .get<any[]>(`${API_URL}/internships/completed`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getStudentsByInternship(internshipId: number): Observable<any[]> {
    return this.http
      .get<any[]>(`${API_URL}/internships/${internshipId}/students`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  

  sendCertificateByEmail(
    certificateId: number,
    email: string
  ): Observable<any> {
    console.log(email);
    
    return this.http
      .post(
        `${API_URL}/${certificateId}/send-email?recipientEmail=${email}`,
        {  },
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }
}
