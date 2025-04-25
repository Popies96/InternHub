import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
  export interface Topic {
    id?: number;
    title: string;
    content: string;
    category: string;
    tags: string[];
    userId: number;
    prenom: string;
    dateCreated?: Date;
    imagePath?: string;
    views: number;
  }

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  private baseUrl = 'http://localhost:8088/internhub/topic'; // Adjust your backend URL accordingly
  private imageBaseUrl = 'http://localhost:8088/internhub';

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
  createTopic(userId: number, topic: any, file?: File): Observable<any> {
    const formData = new FormData();
    formData.append(
      'topic',
      new Blob([JSON.stringify(topic)], { type: 'application/json' })
    );
    if (file) {
      formData.append('file', file);
    }

    return this.http.post<any>(`${this.baseUrl}/create/${userId}`, formData);
  }
  updateTopic(
    id: number,
    userId: number,
    topic: any,
    file?: File
  ): Observable<any> {
    const formData = new FormData();
    formData.append(
      'topic',
      new Blob([JSON.stringify(topic)], { type: 'application/json' })
    );

    if (file) {
      formData.append('file', file);
    }

    return this.http.post<any>(
      `${this.baseUrl}/update/${id}/${userId}`,
      formData
    ); // Use POST instead of PUT
  }

  incrementViewCount(id: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/view/${id}`, null);
  }

  private getImageUrl(imagePath: string | undefined): string | undefined {
    return imagePath
      ? `${this.imageBaseUrl}/topic/image/${imagePath}`
      : undefined;
  }
  // Get a single topic by ID
  getTopicById(id: number): Observable<Topic> {
    return this.http.get<Topic>(`${this.baseUrl}/${id}`).pipe(
      map((topic) => ({
        ...topic,
        imageUrl: this.getImageUrl(topic.imagePath),
      }))
    );
  }
  // Search topics by keyword
  searchTopics(keyword: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/${keyword}`);
  }

  // Update a topic

  // Delete a topic
  deleteTopic(id: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/${userId}`);
  }

  uploadImage(formData: FormData): Observable<string> {
    return this.http.post(
      'http://localhost:8088/internhub/image/upload',
      formData,
      { responseType: 'text' }
    );
  }
}
