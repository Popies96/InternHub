import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Certificate } from '../models/Certificat';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private apiUrl = 'http://localhost:8088/tpfoyer/certificates';

  constructor(private http: HttpClient) { }

  getAllCertificates(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(this.apiUrl);
  }

  getCertificateById(id: number): Observable<Certificate> {
    return this.http.get<Certificate>(`${this.apiUrl}/${id}`);
  }

  createCertificate(certificate: Certificate): Observable<Certificate> {
    return this.http.post<Certificate>(this.apiUrl, certificate);
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
}
