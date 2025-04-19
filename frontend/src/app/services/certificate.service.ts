import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Certificate } from '../models/Certificat';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private apiUrl = 'http://localhost:8088/internhub/certificates';

  constructor(private http: HttpClient) { }

  getAllCertificates(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(this.apiUrl);
  }

  getCertificateById(id: number): Observable<Certificate> {
    return this.http.get<Certificate>(`${this.apiUrl}/${id}`);
  }

  createCertificate(certificateData: any): Observable<any> {
    console.log('Request payload:', JSON.stringify(certificateData, null, 2));
    return this.http.post(`${this.apiUrl}`, certificateData).pipe(
      tap(response => console.log('Response:', response)),
      catchError(error => {
        console.error('Full error:', error);
        return throwError(() => error);
      })
    );
  }
getCertificateDetails(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${id}/details`);
}
  updateCertificate(id: number, certificate: Certificate): Observable<Certificate> {
    return this.http.put<Certificate>(`${this.apiUrl}/${id}`, certificate);
  }

  deleteCertificate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCertificatesByStudent(studentId: number): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${this.apiUrl}/student/${studentId}`);
  }

  getCertificatesByInternship(internshipId: number): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${this.apiUrl}/internship/${internshipId}`);
  }

  revokeCertificate(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/revoke`, {});
  }
 getAllInternships(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/internships`);
}

getStudentsByInternship(internshipId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/internships/${internshipId}/students`);
}

}
