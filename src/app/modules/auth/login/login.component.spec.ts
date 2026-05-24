import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['login', 'isAuthenticated', 'logout']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    authServiceMock.isAuthenticated.and.returnValue(false);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  describe('Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should build login form with email and password controls', () => {
      fixture.detectChanges();
      expect(component.loginForm.get('email')).toBeTruthy();
      expect(component.loginForm.get('password')).toBeTruthy();
    });

    it('should initialize with empty form values', () => {
      fixture.detectChanges();
      expect(component.loginForm.value).toEqual({ email: '', password: '' });
    });

    it('should set loading to false initially', () => {
      expect(component.loading).toBe(false);
    });

    it('should set error to empty string initially', () => {
      expect(component.error).toBe('');
    });

    it('should check if user is already authenticated on init', () => {
      fixture.detectChanges();
      expect(authServiceMock.isAuthenticated).toHaveBeenCalled();
    });

    it('should redirect to /products if already authenticated', () => {
      authServiceMock.isAuthenticated.and.returnValue(true);
      fixture.detectChanges();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should mark form as invalid when empty', () => {
      expect(component.loginForm.invalid).toBe(true);
    });

    it('should require email', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('');
      expect(emailControl?.hasError('required')).toBe(true);
    });

    it('should validate email format', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBe(true);
    });

    it('should accept valid email', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('test@example.com');
      expect(emailControl?.hasError('email')).toBe(false);
    });

    it('should require password', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('');
      expect(passwordControl?.hasError('required')).toBe(true);
    });

    it('should mark form as valid with correct values', () => {
      component.loginForm.setValue({
        email: 'test@example.com',
        password: '123456'
      });
      expect(component.loginForm.valid).toBe(true);
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should show error when form is invalid', () => {
      component.onSubmit();
      expect(component.error).toBe('Preencha login e senha.');
    });

    it('should set loading to true on submit', () => {
      component.loginForm.setValue({
        email: 'test@example.com',
        password: '123456'
      });
      authServiceMock.login.and.returnValue(of({
        user: { name: 'Test', lastName: 'User', email: 'test@example.com', role: 'USER' },
        token: 'test-token'
      }));

      component.onSubmit();
      expect(component.loading).toBe(true);
    });

    it('should clear error and success on submit', () => {
      component.error = 'Previous error';
      component.success = true;
      component.loginForm.setValue({
        email: 'test@example.com',
        password: '123456'
      });
      authServiceMock.login.and.returnValue(of({
        user: { name: 'Test', lastName: 'User', email: 'test@example.com', role: 'USER' },
        token: 'test-token'
      }));

      component.onSubmit();
      expect(component.error).toBe('');
      expect(component.success).toBe(false);
    });

    it('should call authService.login with form values', () => {
      component.loginForm.setValue({
        email: 'test@example.com',
        password: '123456'
      });
      authServiceMock.login.and.returnValue(of({
        user: { name: 'Test', lastName: 'User', email: 'test@example.com', role: 'USER' },
        token: 'test-token'
      }));

      component.onSubmit();
      expect(authServiceMock.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: '123456'
      });
    });

    it('should set success to true and navigate on successful login', (done) => {
      component.loginForm.setValue({
        email: 'test@example.com',
        password: '123456'
      });
      authServiceMock.login.and.returnValue(of({
        user: { name: 'Test', lastName: 'User', email: 'test@example.com', role: 'USER' },
        token: 'test-token'
      }));

      component.onSubmit();
      setTimeout(() => {
        expect(component.success).toBe(true);
        expect(component.loading).toBe(false);
        expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
        done();
      }, 0);
    });

    it('should set error message on login failure', (done) => {
      component.loginForm.setValue({
        email: 'test@example.com',
        password: 'wrong-password'
      });
      authServiceMock.login.and.returnValue(throwError(() => new Error('Unauthorized')));

      component.onSubmit();
      setTimeout(() => {
        expect(component.error).toBe('Falha ao autenticar. Verifique suas credenciais.');
        expect(component.loading).toBe(false);
        expect(routerMock.navigate).not.toHaveBeenCalled();
        done();
      }, 0);
    });

    it('should not navigate on login failure', (done) => {
      component.loginForm.setValue({
        email: 'test@example.com',
        password: 'wrong-password'
      });
      authServiceMock.login.and.returnValue(throwError(() => new Error('Unauthorized')));

      component.onSubmit();
      setTimeout(() => {
        expect(routerMock.navigate).not.toHaveBeenCalledWith(['/products']);
        done();
      }, 0);
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render form with email input', () => {
      const emailInput = fixture.nativeElement.querySelector('#email');
      expect(emailInput).toBeTruthy();
      expect(emailInput.type).toBe('text');
    });

    it('should render form with password input', () => {
      const passwordInput = fixture.nativeElement.querySelector('#password');
      expect(passwordInput).toBeTruthy();
      expect(passwordInput.type).toBe('password');
    });

    it('should render submit button', () => {
      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button).toBeTruthy();
    });

    it('should disable submit button when loading', () => {
      component.loading = true;
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button.disabled).toBe(true);
    });

    it('should show loading text when loading', () => {
      component.loading = true;
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button.textContent).toContain('Enviando...');
    });

    it('should show default button text when not loading', () => {
      component.loading = false;
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button.textContent).toContain('Ok');
    });

    it('should display error message when error is set', () => {
      component.error = 'Login failed';
      fixture.detectChanges();
      const errorElement = fixture.nativeElement.querySelector('.error');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent).toContain('Login failed');
    });

    it('should not display error message when error is empty', () => {
      component.error = '';
      fixture.detectChanges();
      const errorElement = fixture.nativeElement.querySelector('.error');
      expect(errorElement).toBeFalsy();
    });
  });
});
