import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BaseService } from '../../../shared/services/base.service';
import { LoginUser, LoginCredentials, LoginResponse } from '../interfaces/login.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {
  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.post<LoginResponse>('/sessions', credentials).pipe(
      tap((response) => this.setSession(response))
    );
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getUser(): LoginUser | null {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  private setSession(response: LoginResponse): void {
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('auth_user', JSON.stringify(response.user));
  }
}
