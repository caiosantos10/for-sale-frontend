import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { RegisterService } from './register.service';
import { RegisterRequest } from '../interfaces/register.interface';

describe('RegisterService', () => {
  let service: RegisterService;
  let httpClientMock: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientMock = jasmine.createSpyObj('HttpClient', ['post']);

    TestBed.configureTestingModule({
      providers: [
        RegisterService,
        { provide: HttpClient, useValue: httpClientMock }
      ]
    });

    service = TestBed.inject(RegisterService);
  });

  describe('Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should extend BaseService', () => {
      expect(service['apiBaseUrl']).toBeDefined();
    });
  });

  describe('register()', () => {
    it('should call post method', () => {
      const payload: RegisterRequest = {
        name: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: '123456',
        role: 'CUSTOMER'
      };

      httpClientMock.post.and.returnValue(of({ id: 1 }));
      service.register(payload).subscribe();
      expect(httpClientMock.post).toHaveBeenCalled();
    });

    it('should return response', (done) => {
      const payload: RegisterRequest = {
        name: 'Admin',
        lastName: 'Teste',
        email: 'admin@email.com',
        password: '123456',
        role: 'ADMIN'
      };

      httpClientMock.post.and.returnValue(of({ id: 1 }));
      service.register(payload).subscribe((result) => {
        expect(result).toEqual({ id: 1 });
        done();
      });
    });
  });
});
