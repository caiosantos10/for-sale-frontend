import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { LoginCredentials } from '../interfaces/login.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';
  success = false;

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.error = 'Preencha login e senha.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = false;

    const credentials = this.loginForm.value as LoginCredentials;

    this.authService.login(credentials)
      .pipe(
        catchError(() => {
          this.error = 'Falha ao autenticar. Verifique suas credenciais.';
          this.loading = false;
          return of(null);
        })
      )
      .subscribe((response) => {
        this.loading = false;

        if (response) {
          this.success = true;
        }
      });
  }
}
