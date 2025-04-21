import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Topic {
  id?: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  userId: number;
  prenom: string;
  dateCreated?: Date;
}

@Injectable({ providedIn: 'root' })
export class TopicService {
  private baseUrl = 'http://localhost:8088/internhub/topic'; // Adjust your backend URL accordingly

  constructor(private http: HttpClient) {}

  // Get all topics
  getAllTopics(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  // Get topics by category
  getTopicsByCategory(category: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/category/${category}`);
  }

  // Create a new topic
  createTopic(userId: number, topic: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/create/${userId}`, topic);
  }

  // Get a single topic by ID
  getTopicById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // Search topics by keyword
  searchTopics(keyword: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/${keyword}`);
  }

  // Update a topic
  updateTopic(id: number, userId: number, topic: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update/${id}/${userId}`, topic);
  }

  // Delete a topic
  deleteTopic(id: number,userId:number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/${userId}`);
  }
}