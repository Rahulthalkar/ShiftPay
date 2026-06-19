import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AdvanceService {
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

    create(payload: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/Advance/CreateAdvance`, payload, this.getHttpOptions());
    }
    getAllAdvances(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/Advance/GetAllAdvances`, this.getHttpOptions());
    }
    getAdvanceById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/Advance/GetAdvanceById/${id}`, this.getHttpOptions());
    }
    update(payload: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/Advance/UpdateAdvance`, payload, this.getHttpOptions());
    }
}