import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AdvanceService {
    private apiUrl = environment.apiUrl;

    private http = inject(HttpClient)

    create(payload: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/Advance/CreateAdvance`, payload);
    }
    getAllAdvances(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/Advance/GetAllAdvances`);
    }
    getAdvanceById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/Advance/GetAdvanceById/${id}`);
    }
    update(payload: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/Advance/UpdateAdvance`, payload);
    }
} 