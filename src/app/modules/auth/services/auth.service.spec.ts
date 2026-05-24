import 'jasmine';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpClientMock: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientMock = jasmine.createSpyObj('HttpClient', ['post']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: HttpClient, useValue: httpClientMock }
      ]
    });

    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should extend BaseService', () => {
      expect(service['apiBaseUrl']).toBeDefined();
    });
  });

  describe('login()', () => {
    it('should call post method', () => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      const response = {
        token: 'test-token-123',
        user: { name: 'John', lastName: 'Doe', email: 'test@example.com', role: 'USER' }
      };

      httpClientMock.post.and.returnValue(of(response));

      service.login(credentials).subscribe();

      expect(httpClientMock.post).toHaveBeenCalled();
    });

    it('should save token and user on successful login', (done) => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      const response = {
        token: 'test-token-123',
        user: { name: 'John', lastName: 'Doe', email: 'test@example.com', role: 'USER' }
      };

      httpClientMock.post.and.returnValue(of(response));

      service.login(credentials).subscribe(() => {
        expect(localStorage.getItem('auth_token')).toBe('test-token-123');
        const storedUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
        expect(storedUser.email).toBe('test@example.com');
        done();
      });
    });
  });

  describe('getToken()', () => {
    it('should return token from localStorage', () => {
      localStorage.setItem('auth_token', 'test-token');
      const token = service.getToken();
      expect(token).toBe('test-token');
    });

    it('should return null when token does not exist', () => {
      const token = service.getToken();
      expect(token).toBeNull();
    });
  });

  describe('getUser()', () => {
    it('should return parsed user from localStorage', () => {
      const user = {
        name: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        role: 'USER'
      };
      localStorage.setItem('auth_user', JSON.stringify(user));
      const retrievedUser = service.getUser();
      expect(retrievedUser).toEqual(user);
    });

    it('should return null when user does not exist', () => {
      const user = service.getUser();
      expect(user).toBeNull();
    });

    it('should handle corrupted user data gracefully', () => {
      localStorage.setItem('auth_user', 'invalid-json');
      expect(() => service.getUser()).toThrow();
    });
  });

  describe('isAuthenticated()', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('auth_token', 'test-token');
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false when token does not exist', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should check token presence correctly', () => {
      localStorage.removeItem('auth_token');
      expect(service.isAuthenticated()).toBe(false);

      localStorage.setItem('auth_token', 'token-value');
      expect(service.isAuthenticated()).toBe(true);
    });
  });

  describe('logout()', () => {
    it('should remove auth_token from localStorage', () => {
      localStorage.setItem('auth_token', 'test-token');
      service.logout();
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should remove auth_user from localStorage', () => {
      localStorage.setItem('auth_user', JSON.stringify({ name: 'John' }));
      service.logout();
      expect(localStorage.getItem('auth_user')).toBeNull();
    });

    it('should clear both token and user on logout', () => {
      localStorage.setItem('auth_token', 'test-token');
      localStorage.setItem('auth_user', JSON.stringify({ name: 'John' }));
      service.logout();
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('auth_user')).toBeNull();
    });
  });

});
