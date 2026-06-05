import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { APIResult } from '../interface/models';

@Injectable({
  providedIn: 'root',
})
export class admindashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllAuditLogs() {
    const url = this.apiUrl + `/AuditLog/GetAllAuditLogs`;
    return this.http.get(url);
  }
  getDashboardStats() {
    const url = `${this.apiUrl}/Dashboard/GetAdminDashboardStats`;
    return this.http.get<APIResult<any>>(url);
  }

}