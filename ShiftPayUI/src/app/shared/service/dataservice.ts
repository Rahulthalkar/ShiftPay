import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }


  login(model: any) {
    return this.http.post(this.apiUrl + '/Account/Login', model);
  }

  // Attendance
  markAttendance(attendance: any) {
    return this.http.post(this.apiUrl + '/Attendance/CreateAttendance', attendance);
  }

  getAttendanceByUserId(userId: number) {
    return this.http.get(this.apiUrl + `/Attendance/GetAttendancesByUserId/${userId}`);
  }

  getWorkerDashboard(
    workerId: number,
    startDate?: string,
    endDate?: string
  ) {
    const url =
      this.apiUrl +
      `/Attendance/GetDashboardByWorkerFilter?userId=${workerId}` +
      (startDate ? `&startDate=${startDate}` : '') +
      (endDate ? `&endDate=${endDate}` : '');

    return this.http.get(url);
  }

  // Advances
  addAdvancePayment(advance: any) {
    return this.http.post(this.apiUrl + '/Advance/AddAdvancePayment', advance);
  }

  getAdvancesByWorkerId(workerId: number, startDate?: string, endDate?: string) {
    const url =
      this.apiUrl +
      `/Advance/GetAdvancesByWorkerId/${workerId}` +
      (startDate ? `&startDate=${startDate}` : '') +
      (endDate ? `&endDate=${endDate}` : '');

    return this.http.get(url);
  }

  // Supervisor-specific endpoints
  getAllWorkersBySupervisorId(supervisorId: number) {
    return this.http.get(this.apiUrl + `/Attendance/GetAllWorkerBySupervisorId?SupervisorId=${supervisorId}`);
  }
  getAllAttendance() {
    const url = this.apiUrl + `/Attendance/GetAllAttendance`;
    return this.http.get(url);
  }

  approvalAttendanceByManagerBatch(payload: any) {
    return this.http.post(this.apiUrl + '/Attendance/ApprovalAttendanceByManagerBatch', payload);
  }
}
