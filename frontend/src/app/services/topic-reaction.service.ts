import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TopicReactionService {
  private baseUrl = 'http://localhost:8088/internhub/reactions'; // Change if needed

  constructor(private http: HttpClient) {}

  reactToTopic(
    topicId: number,
    userId: number,
    reactionType: 'like' | 'dislike'
  ): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/${topicId}/${reactionType}/${userId}`,
      { topicId, userId, reactionType }
    );
  }

  countLikes(topicId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/${topicId}/likes`);
  }

  countDislikes(topicId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/${topicId}/dislikes`);
  }

  getUserReaction(
    topicId: number,
    userId: number
  ): Observable<'LIKE' | 'DISLIKE' | 'NONE'> {
    return this.http.get<'LIKE' | 'DISLIKE' | 'NONE'>(
      `${this.baseUrl}/${topicId}/reaction/${userId}`
    );
  }
}
