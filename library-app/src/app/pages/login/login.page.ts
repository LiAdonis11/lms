import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel, IonInput, IonButton, IonItem, IonList, IonNote, IonLoading, IonText } from '@ionic/angular/standalone';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  template: `
    <ion-content [fullscreen]="true" class="login-content">
      <div class="login-container">
        <div class="logo-section">
          <h1>Library</h1>
          <p>Management System</p>
        </div>

        <ion-card class="login-card">
          <ion-card-content>
            <form (ngSubmit)="onLogin()">
              <ion-list lines="none">
                <ion-item>
                  <ion-label position="stacked">Email</ion-label>
                  <ion-input type="email" [(ngModel)]="email" name="email" placeholder="Enter your email" required></ion-input>
                </ion-item>

                <ion-item>
                  <ion-label position="stacked">Password</ion-label>
                  <ion-input type="password" [(ngModel)]="password" name="password" placeholder="Enter your password" required></ion-input>
                </ion-item>

                <ion-note color="danger" *ngIf="error" class="error-note">{{ error }}</ion-note>

                <ion-button type="submit" expand="block" size="large" [disabled]="loading" class="login-btn">
                  <ion-spinner *ngIf="loading" name="lines-small"></ion-spinner>
                  <span *ngIf="!loading">Sign In</span>
                </ion-button>

                <div class="register-link">
                  <p>Don't have an account? <a (click)="goToRegister()">Register</a></p>
                </div>
              </ion-list>
            </form>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
  styles: [`
    .login-content {
      --background: var(--ion-color-light);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .login-container {
      width: 100%;
      max-width: 400px;
      padding: 24px;
    }
    .logo-section {
      text-align: center;
      margin-bottom: 32px;
    }
    .logo-section h1 {
      font-family: 'Playfair Display', serif;
      font-size: 36px;
      color: var(--ion-color-primary);
      margin: 0;
    }
    .logo-section p {
      color: var(--ion-color-secondary);
      font-size: 16px;
      margin: 4px 0 0;
    }
    .login-card {
      --background: var(--ion-card-background);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    ion-item {
      --background: transparent;
      --padding-start: 0;
      --padding-end: 0;
      margin-bottom: 16px;
      --border-radius: 8px;
    }
    ion-input {
      --padding-start: 12px;
      --padding-end: 12px;
    }
    .login-btn {
      margin-top: 24px;
      --background: var(--ion-color-primary);
    }
    .error-note {
      margin: 8px 0;
    }
    .register-link {
      text-align: center;
      margin-top: 16px;
    }
    .register-link p {
      color: var(--ion-color-medium);
      margin: 0;
    }
    .register-link a {
      color: var(--ion-color-secondary);
      cursor: pointer;
      font-weight: 500;
    }
  `],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel, IonInput, IonButton, IonItem, IonList, IonNote, IonLoading, IonText]
})
export class LoginPage {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private api: ApiService, private router: Router) {}

  onLogin() {
    if (!this.email || !this.password) {
      this.error = 'Please enter email and password';
      return;
    }

    this.loading = true;
    this.error = '';

    this.api.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        const isAdmin = this.api.isAdmin;
        this.router.navigateByUrl(isAdmin ? '/admin/dashboard' : '/client/home');
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Login failed';
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}