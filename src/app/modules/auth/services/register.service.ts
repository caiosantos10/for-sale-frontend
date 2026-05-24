import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../../shared/services/base.service';
import { RegisterRequest, RegisterResponse } from '../interfaces/register.interface';

@Injectable({
  providedIn: 'root'
})
export class RegisterService extends BaseService {
  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.post<RegisterResponse>('/users', payload);
  }
}
