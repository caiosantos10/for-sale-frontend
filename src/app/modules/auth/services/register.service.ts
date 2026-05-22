import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../../shared/services/base.service';
import { RegisterRequest } from '../interfaces/register.interface';

@Injectable({
  providedIn: 'root'
})
export class RegisterService extends BaseService {
  register(payload: RegisterRequest): Observable<RegisterRequest> {
    return this.post<RegisterRequest>('/users', payload);
  }
}
