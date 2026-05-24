import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { RegisterService } from '../services/register.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let registerServiceMock: jasmine.SpyObj<RegisterService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    registerServiceMock = jasmine.createSpyObj('RegisterService', ['register']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        { provide: RegisterService, useValue: registerServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
  });

  describe('Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should build register form with all required fields', () => {
      fixture.detectChanges();
      expect(component.registerForm.get('name')).toBeTruthy();
      expect(component.registerForm.get('lastName')).toBeTruthy();
      expect(component.registerForm.get('email')).toBeTruthy();
      expect(component.registerForm.get('password')).toBeTruthy();
      expect(component.registerForm.get('role')).toBeTruthy();
    });

    it('should initialize with empty form values except role', () => {
      fixture.detectChanges();
      expect(component.registerForm.value).toEqual({
        name: '',
        lastName: '',
        email: '',
        password: '',
        role: 'CUSTOMER'
      });
    });

    it('should set loading to false initially', () => {
      expect(component.loading).toBe(false);
    });

    it('should set error to empty string initially', () => {
      expect(component.error).toBe('');
    });

    it('should have role field defaulting to CUSTOMER', () => {
      fixture.detectChanges();
      expect(component.registerForm.get('role')?.value).toBe('CUSTOMER');
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should mark form as invalid when empty', () => {
      component.registerForm.reset();
      expect(component.registerForm.invalid).toBe(true);
    });

    it('should require name', () => {
      const nameControl = component.registerForm.get('name');
      nameControl?.setValue('');
      expect(nameControl?.hasError('required')).toBe(true);
    });

    it('should accept valid name', () => {
      const nameControl = component.registerForm.get('name');
      nameControl?.setValue('John');
      expect(nameControl?.hasError('required')).toBe(false);
    });

    it('should require lastName', () => {
      const lastNameControl = component.registerForm.get('lastName');
      lastNameControl?.setValue('');
      expect(lastNameControl?.hasError('required')).toBe(true);
    });

    it('should accept valid lastName', () => {
      const lastNameControl = component.registerForm.get('lastName');
      lastNameControl?.setValue('Doe');
      expect(lastNameControl?.hasError('required')).toBe(false);
    });

    it('should require email', () => {
      const emailControl = component.registerForm.get('email');
      emailControl?.setValue('');
      expect(emailControl?.hasError('required')).toBe(true);
    });

    it('should validate email format', () => {
      const emailControl = component.registerForm.get('email');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBe(true);
    });

    it('should accept valid email', () => {
      const emailControl = component.registerForm.get('email');
      emailControl?.setValue('test@example.com');
      expect(emailControl?.hasError('email')).toBe(false);
    });

    it('should require password', () => {
      const passwordControl = component.registerForm.get('password');
      passwordControl?.setValue('');
      expect(passwordControl?.hasError('required')).toBe(true);
    });

    it('should validate minimum password length (6 characters)', () => {
      const passwordControl = component.registerForm.get('password');
      passwordControl?.setValue('12345');
      expect(passwordControl?.hasError('minlength')).toBe(true);
    });

    it('should accept password with 6 or more characters', () => {
      const passwordControl = component.registerForm.get('password');
      passwordControl?.setValue('123456');
      expect(passwordControl?.hasError('minlength')).toBe(false);
    });

    it('should require role', () => {
      const roleControl = component.registerForm.get('role');
      roleControl?.setValue('');
      expect(roleControl?.hasError('required')).toBe(true);
    });

    it('should mark form as valid with all correct values', () => {
      component.registerForm.setValue({
        name: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: '123456',
        role: 'CUSTOMER'
      });
      expect(component.registerForm.valid).toBe(true);
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should show error when form is invalid', () => {
      component.onSubmit();
      expect(component.error).toBe('Please fill in the fields correctly.');
    });

    it('should not call register service when form is invalid', () => {
      component.onSubmit();
      expect(registerServiceMock.register).not.toHaveBeenCalled();
    });

    it('should set loading to true on submit', () => {
      component.registerForm.setValue({
        name: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: '123456',
        role: 'CUSTOMER'
      });
      registerServiceMock.register.and.returnValue(of({ id: 1 }));

      component.onSubmit();
      expect(component.loading).toBe(true);
    });

    it('should clear error on submit', () => {
      component.error = 'Previous error';
      component.registerForm.setValue({
        name: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: '123456',
        role: 'CUSTOMER'
      });
      registerServiceMock.register.and.returnValue(of({ id: 1 }));

      component.onSubmit();
      expect(component.error).toBe('');
    });

    it('should call registerService.register with form values', () => {
      const payload = {
        name: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: '123456',
        role: 'ADMIN'
      };
      component.registerForm.setValue(payload);
      registerServiceMock.register.and.returnValue(of({ id: 1 }));

      component.onSubmit();
      expect(registerServiceMock.register).toHaveBeenCalledWith(payload);
    });

    it('should set loading to false and navigate on successful registration', (done) => {
      component.registerForm.setValue({
        name: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: '123456',
        role: 'CUSTOMER'
      });
      registerServiceMock.register.and.returnValue(of({ id: 1 }));

      component.onSubmit();
      setTimeout(() => {
        expect(component.loading).toBe(false);
        expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
        done();
      }, 0);
    });

    it('should set error message on registration failure', (done) => {
      component.registerForm.setValue({
        name: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: '123456',
        role: 'CUSTOMER'
      });
      registerServiceMock.register.and.returnValue(throwError(() => new Error('Server error')));

      component.onSubmit();
      setTimeout(() => {
        expect(component.error).toBe('Failed to register.');
        expect(component.loading).toBe(false);
        done();
      }, 0);
    });

    it('should not navigate on registration failure', (done) => {
      component.registerForm.setValue({
        name: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: '123456',
        role: 'CUSTOMER'
      });
      registerServiceMock.register.and.returnValue(throwError(() => new Error('Server error')));

      component.onSubmit();
      setTimeout(() => {
        expect(routerMock.navigate).not.toHaveBeenCalled();
        done();
      }, 0);
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render form with name input', () => {
      const nameInput = fixture.nativeElement.querySelector('#name');
      expect(nameInput).toBeTruthy();
      expect(nameInput.type).toBe('text');
    });

    it('should render form with lastName input', () => {
      const lastNameInput = fixture.nativeElement.querySelector('#lastName');
      expect(lastNameInput).toBeTruthy();
      expect(lastNameInput.type).toBe('text');
    });

    it('should render form with email input', () => {
      const emailInput = fixture.nativeElement.querySelector('#email');
      expect(emailInput).toBeTruthy();
      expect(emailInput.type).toBe('email');
    });

    it('should render form with password input', () => {
      const passwordInput = fixture.nativeElement.querySelector('#password');
      expect(passwordInput).toBeTruthy();
      expect(passwordInput.type).toBe('password');
    });

    it('should render role select with USER and ADMIN options', () => {
      const roleSelect = fixture.nativeElement.querySelector('#role');
      expect(roleSelect).toBeTruthy();
      const options = roleSelect.querySelectorAll('option');
      expect(options.length).toBe(2);
      expect(options[0].value).toBe('USER');
      expect(options[1].value).toBe('ADMIN');
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
      expect(button.textContent).toContain('Cadastrar');
    });

    it('should display error message when error is set', () => {
      component.error = 'Registration failed';
      fixture.detectChanges();
      const errorElement = fixture.nativeElement.querySelector('.error');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent).toContain('Registration failed');
    });

    it('should not display error message when error is empty', () => {
      component.error = '';
      fixture.detectChanges();
      const errorElement = fixture.nativeElement.querySelector('.error');
      expect(errorElement).toBeFalsy();
    });
  });
});
