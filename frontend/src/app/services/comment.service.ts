import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Comment {
  id?: number;
  comment: string;
  userId: number;
  topicId: number;
  username?: string; // Optional field for username
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private baseUrl = 'http://localhost:8088/internhub/topic';

  constructor(private http: HttpClient) {}

  addComment(comment: Comment,topicid:number,userId:number): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseUrl}/${topicid}/${userId}/addcomment`, comment);
  }

  getCommentsByTopic(topicId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/comments/${topicId}`);
  }
  CommentCount(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/comments/count/${id}`);
  }

}
