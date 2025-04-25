import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http: HttpClient) {}

  uploadFile(url: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true
    });

    return this.http.request(req);
  }}
