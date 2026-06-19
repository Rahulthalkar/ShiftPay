import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ResetRequestModel } from '../interface/models';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers':
        'Origin, Content-Type, Accept, X-Custom-Header, Upgrade-Insecure-Requests',
      'Content-Type': 'application/json',
    }),
    withCredentials: true,
  };

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

    return this.http.get(url, this.httpOptions);
  }

  // Advances
  addAdvancePayment(advance: any) {
    return this.http.post(this.apiUrl + '/Advance/AddAdvancePayment', advance, this.httpOptions);
  }

  getAdvancesByWorkerId(workerId: number, startDate?: string, endDate?: string) {
    const url =
      this.apiUrl +
      `/Advance/GetAdvancesByWorkerId/${workerId}` +
      (startDate ? `&startDate=${startDate}` : '') +
      (endDate ? `&endDate=${endDate}` : '');

    return this.http.get(url, this.httpOptions);
  }

  // Supervisor-specific endpoints
  getAllWorkersBySupervisorId(supervisorId: number) {
    return this.http.get(this.apiUrl + `/Attendance/GetAllWorkerBySupervisorId?SupervisorId=${supervisorId}`, this.httpOptions);
  }
  getAllAttendance() {
    const url = this.apiUrl + `/Attendance/GetAllAttendance`;
    return this.http.get(url, this.httpOptions);
  }

  approvalAttendanceByManagerBatch(payload: any) {
    return this.http.post(this.apiUrl + '/Attendance/ApprovalAttendanceByManagerBatch', payload, this.httpOptions);
  }

  // Password Recovery
  forgotPassword(model: ResetRequestModel) {
    return this.http.post(this.apiUrl + '/Account/ForgotPassword', model, this.httpOptions);
  }

  validateResetPasswordGUID(guid: string) {
    return this.http.post(this.apiUrl + '/Account/IsValidateResetPasswordGUID?guid=' + guid, {}, this.httpOptions);
  }

  resetPassword(payload: any) {
    return this.http.post(this.apiUrl + '/Account/ResetPassword', payload, this.httpOptions);
  }
  changePassword(payload: any) {
    return this.http.post(this.apiUrl + '/Account/ChangePassword', payload, this.httpOptions);
  }
}
