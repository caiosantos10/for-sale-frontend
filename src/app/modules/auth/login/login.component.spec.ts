import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../services/auth.service';

const mockAuthService = {
  isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(false),
  login: jasmine.createSpy('login').and.returnValue(of({ token: 'abc' })),
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;

  beforeEach(async () => {
    mockAuthService.isAuthenticated.calls.reset();
    mockAuthService.login.calls.reset();
    mockAuthService.isAuthenticated.and.returnValue(false);
    mockAuthService.login.and.returnValue(of({ token: 'abc' }));

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  // ─── Estrutura ───────────────────────────────────────────────────────────────

  describe('Structure', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should render email and password inputs', () => {
      const email = fixture.debugElement.query(By.css('#email'));
      const password = fixture.debugElement.query(By.css('#password'));
      expect(email).toBeTruthy();
      expect(password).toBeTruthy();
    });

    it('should render the submit button', () => {
      const btn = fixture.debugElement.query(By.css('button[type="submit"]'));
      expect(btn).toBeTruthy();
    });

    it('should NOT show error message initially', () => {
      const error = fixture.debugElement.query(By.css('.error'));
      expect(error).toBeNull();
    });
  });

  // ─── ngOnInit ─────────────────────────────────────────────────────────────────

  describe('ngOnInit', () => {
    it('should build the login form with email and password controls', () => {
      expect(component.loginForm.contains('email')).toBeTrue();
      expect(component.loginForm.contains('password')).toBeTrue();
    });

    it('should redirect to /products if already authenticated', async () => {
      mockAuthService.isAuthenticated.and.returnValue(true);
      const navigateSpy = spyOn(router, 'navigate');
      component.ngOnInit();
      expect(navigateSpy).toHaveBeenCalledWith(['/products']);
    });

    it('should NOT redirect if not authenticated', () => {
      const navigateSpy = spyOn(router, 'navigate');
      component.ngOnInit();
      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });

  // ─── Validação do formulário ──────────────────────────────────────────────────

  describe('Form validation', () => {
    it('should be invalid when empty', () => {
      expect(component.loginForm.invalid).toBeTrue();
    });

    it('should be invalid with wrong email format', () => {
      component.loginForm.setValue({ email: 'nao-e-email', password: '123' });
      expect(component.loginForm.get('email')?.invalid).toBeTrue();
    });

    it('should be valid with correct email and password', () => {
      component.loginForm.setValue({ email: 'user@test.com', password: '123456' });
      expect(component.loginForm.valid).toBeTrue();
    });
  });

  // ─── onSubmit — formulário inválido ──────────────────────────────────────────

  describe('onSubmit with invalid form', () => {
    it('should set error message when form is invalid', () => {
      component.onSubmit();
      expect(component.error).toBe('Preencha login e senha.');
    });

    it('should NOT call authService.login when form is invalid', () => {
      component.onSubmit();
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });

    it('should show error message in the template', () => {
      component.onSubmit();
      fixture.detectChanges();
      const error = fixture.debugElement.query(By.css('.error'));
      expect(error.nativeElement.textContent.trim()).toBe('Preencha login e senha.');
    });
  });

  // ─── onSubmit — sucesso ───────────────────────────────────────────────────────

  describe('onSubmit with valid form — success', () => {
    beforeEach(() => {
      component.loginForm.setValue({ email: 'user@test.com', password: '123456' });
    });

    it('should call authService.login with form credentials', () => {
      component.onSubmit();
      expect(mockAuthService.login).toHaveBeenCalledWith({
        email: 'user@test.com',
        password: '123456',
      });
    });

    it('should set success to true after login', () => {
      component.onSubmit();
      expect(component.success).toBeTrue();
    });

    it('should set loading to false after login', () => {
      component.onSubmit();
      expect(component.loading).toBeFalse();
    });

    it('should navigate to /products after successful login', () => {
      const navigateSpy = spyOn(router, 'navigate');
      component.onSubmit();
      expect(navigateSpy).toHaveBeenCalledWith(['/products']);
    });

    it('should show Loading... on button while loading', () => {
      mockAuthService.login.and.returnValue(of(null));
      component.loading = true;
      fixture.detectChanges();
      const btn = fixture.debugElement.query(By.css('button[type="submit"]'));
      expect(btn.nativeElement.textContent.trim()).toBe('Loading...');
    });

    it('should disable button while loading', () => {
      component.loading = true;
      fixture.detectChanges();
      const btn = fixture.debugElement.query(By.css('button[type="submit"]'));
      expect(btn.nativeElement.disabled).toBeTrue();
    });
  });

  // ─── onSubmit — erro ──────────────────────────────────────────────────────────

  describe('onSubmit with valid form — error', () => {
    beforeEach(() => {
      component.loginForm.setValue({ email: 'user@test.com', password: 'wrong' });
      mockAuthService.login.and.returnValue(throwError(() => new Error('Unauthorized')));
    });

    it('should set error message on login failure', () => {
      component.onSubmit();
      expect(component.error).toBe('Falha ao autenticar. Verifique suas credenciais.');
    });

    it('should set loading to false on login failure', () => {
      component.onSubmit();
      expect(component.loading).toBeFalse();
    });

    it('should NOT set success on failure', () => {
      component.onSubmit();
      expect(component.success).toBeFalse();
    });

    it('should show error message in the template after failure', () => {
      component.onSubmit();
      fixture.detectChanges();
      const error = fixture.debugElement.query(By.css('.error'));
      expect(error.nativeElement.textContent.trim()).toBe(
        'Falha ao autenticar. Verifique suas credenciais.'
      );
    });
  });

  // ─── onSubmit — response null ─────────────────────────────────────────────────

  describe('onSubmit — response null', () => {
    it('should NOT navigate or set success when response is null', () => {
      mockAuthService.login.and.returnValue(of(null));
      component.loginForm.setValue({ email: 'user@test.com', password: '123456' });
      const navigateSpy = spyOn(router, 'navigate');
      component.onSubmit();
      expect(component.success).toBeFalse();
      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });
});
