import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_BASE = 'http://localhost:4000/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  saveCollection(payload: any): Observable<any> {
    return this.http.post(`${API_BASE}/collection`, payload);
  }

  saveTransfusion(payload: any): Observable<any> {
    return this.http.post(`${API_BASE}/transfusion`, payload);
  }

  saveTherapeutic(payload: any): Observable<any> {
    return this.http.post(`${API_BASE}/therapeutic`, payload);
  }

  checkHealth(): Observable<any> {
    return this.http.get(`${API_BASE}/health`);
  }
}
