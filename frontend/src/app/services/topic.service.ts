import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  @Injectable({ providedIn: 'root' })
  export class TopicService {
    private baseUrl = 'http://localhost:8088/internhub/topic'; // Adjust your backend URL accordingly
    private imageBaseUrl = 'http://localhost:8088/internhub';

    constructor(private http: HttpClient) {}

    // Get all topics
    getAllTopics(): Observable<any[]> {
        const headers = this.createAuthorizedHeader();
        if (!headers) {
          throw new Error('No authorization token available');
        }
      return this.http.get<any[]>(`${this.baseUrl}/all`, {
        headers,
      });
    }

    // Get topics by category
    getTopicsByCategory(category: string): Observable<any[]> {
           const headers = this.createAuthorizedHeader();
           if (!headers) {
             throw new Error('No authorization token available');
           }
      return this.http.get<any[]>(`${this.baseUrl}/category/${category}`, {
        headers,
      });
    }

    // Create a new topic
    createTopic(userId: number, topic: any, file?: File): Observable<any> {
           const headers = this.createAuthorizedHeader();
           if (!headers) {
             throw new Error('No authorization token available');
           }
      const formData = new FormData();
      formData.append(
        'topic',
        new Blob([JSON.stringify(topic)], { type: 'application/json' })
      );
      if (file) {
        formData.append('file', file);
      }

      return this.http.post<any>(`${this.baseUrl}/create/${userId}`, formData, {
        headers,
      });
    }
    updateTopic(
      id: number,
      userId: number,
      topic: any,
      file?: File
    ): Observable<any> {
           const headers = this.createAuthorizedHeader();
           if (!headers) {
             throw new Error('No authorization token available');
           }
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
        formData,
        { headers }
      ); // Use POST instead of PUT
    }

    incrementViewCount(id: number): Observable<any> {
           const headers = this.createAuthorizedHeader();
           if (!headers) {
             throw new Error('No authorization token available');
           }
      return this.http.post<any>(`${this.baseUrl}/view/${id}`, null, {
        headers,
      });
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