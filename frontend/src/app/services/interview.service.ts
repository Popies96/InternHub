import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  private apiUrl = 'http://localhost:8088/Internhub/api/interviews';

  constructor(private http: HttpClient) {}

  createInterview(data: any) {
    return this.http.post(this.apiUrl, data);
  }
}
