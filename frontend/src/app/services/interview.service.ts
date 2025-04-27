import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InterviewService {
  private apiUrl = 'http://localhost:8088/internhub/api/interviews';

  constructor(private http: HttpClient) {}

  createInterview(data: any) {
    return this.http.post(this.apiUrl, data);
  }
  getAllInterviews() {
    return this.http.get<any[]>(this.apiUrl);
  }
  deleteInterview(id: number) {
    return this.http.delete(this.apiUrl + '/' + id);
  }
  cancelInterview(id: number) {
    return this.http.patch(this.apiUrl + '/' + id + '/cancel', {});
  }
}
