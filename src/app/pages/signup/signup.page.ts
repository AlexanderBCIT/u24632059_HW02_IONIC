import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authenticate';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false
})
export class SignupPage {

  email = '';
  password = '';
  confirmPassword = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  private isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailPattern.test(email);
  }

  async signup() {
    const cleanEmail = this.email.trim().toLowerCase();

    if (!cleanEmail || !this.password || !this.confirmPassword) {
      alert('Please complete all fields.');
      return;
    }

    if (!this.isValidEmail(cleanEmail)) {
      alert('Please enter a valid email address, for example: user@example.com');
      return;
    }

    if (this.password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    const success = await this.authService.signup(cleanEmail, this.password);

    if (success) {
      alert('Account created successfully. Please log in.');
      this.router.navigateByUrl('/login');
    } else {
      alert('An account with this email already exists.');
    }
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
}