import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { RegisterService } from '../services/register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['CUSTOMER', Validators.required]
    });
  }

  onSubmit(): void {
    console.log('disparou');
    if (this.registerForm.invalid) {
      this.error = 'Please fill in the fields correctly.';
      return;
    }

    this.loading = true;
    this.error = '';

    const payload = this.registerForm.value;

    this.registerService.register(payload)
      .pipe(
        catchError(() => {
          this.error = 'Failed to register.';
          this.loading = false;
          return of(null);
        })
      )
      .subscribe((res) => {
        this.loading = false;
        if (res) {
          this.router.navigate(['/login']);
        }
      });
  }
}
