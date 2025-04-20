import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from '../models/Review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private baseUrl = 'http://localhost:8088/internhub/reviews';

  constructor(private http: HttpClient) {}
  getRatingCriteria(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/rating-criteria`);
  }
  private createAuthorizedHeader(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found in local storage');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllReviews(): Observable<Review[]> {
    const headers = this.createAuthorizedHeader();
    const url = 'http://localhost:8088/internhub/reviews/get_reviews';
    return this.http.get<Review[]>(url, { headers });
  }


  getById(id: number): Observable<Review> {
    const headers = this.createAuthorizedHeader();
    return this.http.get<Review>(`${this.baseUrl}/${id}`, { headers });
  }

  create(review: Review): Observable<Review> {
    const headers = this.createAuthorizedHeader();
    return this.http.post<Review>(this.baseUrl, review, { headers });
  }

  update(id: number, review: Review): Observable<Review> {
    const headers = this.createAuthorizedHeader();
    return this.http.put<Review>(`${this.baseUrl}/${id}`, review, { headers });
  }

  delete(id: number): Observable<void> {
    const headers = this.createAuthorizedHeader();
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers });
  }

  getByReviewee(id: number): Observable<Review[]> {
    const headers = this.createAuthorizedHeader();
    return this.http.get<Review[]>(`${this.baseUrl}/reviewee/${id}`, { headers });
  }

  getByReviewer(id: number): Observable<Review[]> {
    const headers = this.createAuthorizedHeader();
    return this.http.get<Review[]>(`${this.baseUrl}/reviewer/${id}`, { headers });
  }

  getAIRecommendation(): Observable<any> {
    const headers = this.createAuthorizedHeader();
    return this.http.get(`${this.baseUrl}/ai-recommendation`, { headers, responseType: 'text' });
  }
}
