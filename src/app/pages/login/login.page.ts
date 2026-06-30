import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authenticate';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {

  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ionViewWillEnter() {
    this.clearLoginFields();
  }

  private clearLoginFields() {
    this.email = '';
    this.password = '';
  }

  private isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailPattern.test(email);
  }

  async login() {
    const cleanEmail = this.email.trim().toLowerCase();

    if (!cleanEmail || !this.password) {
      alert('Please enter your email and password.');
      return;
    }

    if (!this.isValidEmail(cleanEmail)) {
      alert('Please enter a valid email address.');
      return;
    }

    const success = await this.authService.login(cleanEmail, this.password);

    if (success) {
      this.clearLoginFields();
      this.router.navigateByUrl('/tabs/search', { replaceUrl: true });
    } else {
      alert('Invalid login details.');
      this.password = '';
    }
  }

  goToSignup() {
    this.clearLoginFields();
    this.router.navigateByUrl('/signup');
  }
}