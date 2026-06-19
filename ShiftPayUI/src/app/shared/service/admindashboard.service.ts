import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { APIResult } from '../interface/models';

@Injectable({
  providedIn: 'root',
})
export class admindashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

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

  getAllAuditLogs() {
    const url = this.apiUrl + `/AuditLog/GetAllAuditLogs`;
    return this.http.get(url, this.getHttpOptions());
  }
  getDashboardStats() {
    const url = `${this.apiUrl}/Dashboard/GetAdminDashboardStats`;
    return this.http.get<APIResult<any>>(url, this.getHttpOptions());
  }

}