import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;

  private http = inject(HttpClient)

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers':
          'Origin, Content-Type, Accept, X-Custom-Header, Upgrade-Insecure-Requests',
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      }),
      withCredentials: true,
    };
  }

  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/User/GetUserById?id=${userId}`, this.getHttpOptions())
  }
  getAllUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/User/GetAllUsers`, this.getHttpOptions())
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/User/CreateUser`, user, this.getHttpOptions())
  }

  updateUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/User/UpdateUser`, user, this.getHttpOptions())
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/User/DeleteUser?id=${userId}`, this.getHttpOptions())
  }

  getAllRoles(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/User/GetAllRoles`, this.getHttpOptions())
  }
  getWorkersBySupervisorId(supervisorId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/User/GetWorkersBySupervisorId?supervisorId=${supervisorId}`, this.getHttpOptions());
  }

}
