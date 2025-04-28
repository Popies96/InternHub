import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Comment {
  id?: number;
  comment: string;
  nom: string;
  prenom: string;
  topicId: number;
  username?: string; // Optional field for username
  userId?: number; // Optional field for userId
  dateCreated?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private baseUrl = 'http://localhost:8088/internhub/topic';

  constructor(private http: HttpClient) {}

  addComment(
    comment: Comment,
    topicid: number,
    userId: number
  ): Observable<Comment> {
    return this.http.post<Comment>(
      `${this.baseUrl}/${topicid}/${userId}/addcomment`,
      comment,
      { responseType: 'json' }
    );
  }

  getCommentsByTopic(topicId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/comments/${topicId}`);
  }
  CommentCount(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/comments/count/${id}`);
  }

  deleteComment(id: number, userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/comment/delete/${id}/${userId}`);
  }

  updateComment(
    id: number,
    newContent: string,
    userId: number
  ): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/comment/update/${id}/${userId}`,
      { comment: newContent }
    );
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
