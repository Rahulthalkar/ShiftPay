import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;

  private http = inject(HttpClient)

  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/User/GetUserById?id=${userId}`)
  }
  getAllUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/User/GetAllUsers`)
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/User/CreateUser`, user)
  }

  updateUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/User/UpdateUser`, user)
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/User/DeleteUser?id=${userId}`)
  }

  getAllRoles(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/User/GetAllRoles`)
  }

}
