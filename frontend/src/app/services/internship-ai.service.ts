import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InternshipAi, Task } from '../models/models ';
const baseUrl = 'http://localhost:8088/internhub/internshipAi/';
@Injectable({
  providedIn: 'root'
})
export class InternshipAiService {
  

  constructor(private http : HttpClient) {
   }

     createInternshipAi(data: any): Observable<any> {
       const headers = this.createAuthorizedHeader();
       if (headers) {
         return this.http.post(baseUrl + 'create',data , { headers });
       } else {
         throw new Error('Authorization header creation failed');
       }}

      getInternshipAiList(): Observable<InternshipAi[]> {
        const headers = this.createAuthorizedHeader();
        if (headers) {
          return this.http.get<InternshipAi[]>(baseUrl + 'list', { headers });
        } else {
          throw new Error('Authorization header creation failed');
        }

      }

      deleteInternshipAi(id: number): Observable<any> {
        const headers = this.createAuthorizedHeader();
        if (headers) {
          return this.http.delete(baseUrl + 'delete/' + id, { headers, responseType: 'text' });
        }else{
          throw new Error('Authorization header creation failed');
        }
      }
      getInternshipAiById(id: number): Observable<InternshipAi> {
        const headers = this.createAuthorizedHeader();
        if (headers) {
          return this.http.get<InternshipAi>(baseUrl + 'get/' + id, { headers });
        } else {
          throw new Error('Authorization header creation failed');
        }
      }

      getTaskAiById(id:number):Observable<Task>{
        const headers = this.createAuthorizedHeader();
        if (headers) {
          return this.http.get<Task>(baseUrl + 'task/' + id, {
            headers,
          });
        } else {
          throw new Error('Authorization header creation failed');
        }

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
