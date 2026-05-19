import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  protected apiBaseUrl = environment.apiBaseUrl;

  constructor(protected http: HttpClient) {}

  protected get<T>(endpoint: string, params?: Record<string, string | number | boolean>, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.http.get<T>(this.buildUrl(endpoint), {
      params: this.buildParams(params),
      ...options
    });
  }

  protected post<T>(endpoint: string, body: unknown, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.http.post<T>(this.buildUrl(endpoint), body, options);
  }

  protected put<T>(endpoint: string, body: unknown, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.http.put<T>(this.buildUrl(endpoint), body, options);
  }

  protected delete<T>(endpoint: string, params?: Record<string, string | number | boolean>, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.http.delete<T>(this.buildUrl(endpoint), {
      params: this.buildParams(params),
      ...options
    });
  }

  private buildUrl(endpoint: string): string {
    const url = `${this.apiBaseUrl}/${endpoint}`;
    return url.replace(/([^:]\/)\/+/g, '$1');
  }

  private buildParams(params?: Record<string, string | number | boolean>): HttpParams {
    let httpParams = new HttpParams();

    if (!params) {
      return httpParams;
    }

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        httpParams = httpParams.set(key, String(value));
      }
    });

    return httpParams;
  }
}
