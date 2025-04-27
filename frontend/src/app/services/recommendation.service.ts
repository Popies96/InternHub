import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecommendationService {
  private baseUrl =
    'http://localhost:8088/internhub/reviews/recommendation fr  ';

  constructor(private http: HttpClient) {}

  getRecommendation(
    internshipId: number,
    regenerate: boolean = false
  ): Observable<string> {
    const params = new HttpParams().set('regenerate', regenerate);
    return this.http.post(`${this.baseUrl}/${internshipId}`, null, {
      params,
      responseType: 'text', // because it's a plain string response
    });
  }
}
