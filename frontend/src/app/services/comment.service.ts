import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user.service';

export interface Comment {
  id?: number;
  comment: string;
  user: 
  {
    id: number;
    nom: string;
    prenom: string;
  }
  topicId: number;
  username?: string; // Optional field for username
  userId?: number; // Optional field for userId
  dateCreated?: Date;

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

  deleteComment(id: number, userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/comment/delete/${id}/${userId}`);
  }
  
  updateComment(id: number, newContent: string, userId: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/comment/update/${id}/${userId}`, { comment: newContent });
  }

}
