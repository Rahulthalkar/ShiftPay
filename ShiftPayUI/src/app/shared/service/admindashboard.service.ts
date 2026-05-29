import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

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
}