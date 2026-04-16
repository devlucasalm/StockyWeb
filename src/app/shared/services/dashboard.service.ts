import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dashboard } from '../models/dashboard.interface';
import { AppResponse } from '../models/response.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<AppResponse<Dashboard>> {
    return this.http.get<AppResponse<Dashboard>>(`${this.apiUrl}/Dashboard`);
  }
}
