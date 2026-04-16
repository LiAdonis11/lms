import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel, IonInput, IonButton, IonItem, IonList, IonNote } from '@ionic/angular/standalone';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  template: `
    <ion-content [fullscreen]="true" class="register-content">
      <div class="register-container">
        <div class="header-section">
          <h1>Create Account</h1>
          <p>Join our library today</p>
        </div>

        <ion-card class="register-card">
          <ion-card-content>
            <form (ngSubmit)="onRegister()">
              <ion-list lines="none">
                <ion-item>
                  <ion-label position="stacked">Full Name</ion-label>
                  <ion-input type="text" [(ngModel)]="name" name="name" placeholder="Enter your name" required></ion-input>
                </ion-item>

                <ion-item>
                  <ion-label position="stacked">Email</ion-label>
                  <ion-input type="email" [(ngModel)]="email" name="email" placeholder="Enter your email" required></ion-input>
                </ion-item>

                <ion-item>
                  <ion-label position="stacked">Phone (Optional)</ion-label>
                  <ion-input type="tel" [(ngModel)]="phone" name="phone" placeholder="Enter your phone number"></ion-input>
                </ion-item>

                <ion-item>
                  <ion-label position="stacked">Password</ion-label>
                  <ion-input type="password" [(ngModel)]="password" name="password" placeholder="Create a password" required></ion-input>
                </ion-item>

                <ion-note color="danger" *ngIf="error" class="error-note">{{ error }}</ion-note>

                <ion-button type="submit" expand="block" size="large" [disabled]="loading" class="register-btn">
                  <ion-spinner *ngIf="loading" name="lines-small"></ion-spinner>
                  <span *ngIf="!loading">Create Account</span>
                </ion-button>

                <div class="login-link">
                  <p>Already have an account? <a (click)="goToLogin()">Sign In</a></p>
                </div>
              </ion-list>
            </form>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
  styles: [`
    .register-content {
      --background: var(--ion-color-light);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .register-container {
      width: 100%;
      max-width: 400px;
      padding: 24px;
    }
    .header-section {
      text-align: center;
      margin-bottom: 32px;
    }
    .header-section h1 {
      font-family: 'Playfair Display', serif;
      font-size: 32px;
      color: var(--ion-color-primary);
      margin: 0;
    }
    .header-section p {
      color: var(--ion-color-medium);
      font-size: 14px;
      margin: 4px 0 0;
    }
    .register-card {
      --background: var(--ion-card-background);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    ion-item {
      --background: transparent;
      --padding-start: 0;
      --padding-end: 0;
      margin-bottom: 16px;
    }
    ion-input {
      --padding-start: 12px;
      --padding-end: 12px;
    }
    .register-btn {
      margin-top: 24px;
      --background: var(--ion-color-primary);
    }
    .error-note {
      margin: 8px 0;
    }
    .login-link {
      text-align: center;
      margin-top: 16px;
    }
    .login-link p {
      color: var(--ion-color-medium);
      margin: 0;
    }
    .login-link a {
      color: var(--ion-color-secondary);
      cursor: pointer;
      font-weight: 500;
    }
  `],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel, IonInput, IonButton, IonItem, IonList, IonNote]
})
export class RegisterPage {
  name = '';
  email = '';
  phone = '';
  password = '';
  loading = false;
  error = '';

  constructor(private api: ApiService, private router: Router) {}

  onRegister() {
    if (!this.name || !this.email || !this.password) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.loading = true;
    this.error = '';

    this.api.register({ name: this.name, email: this.email, password: this.password, phone: this.phone }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/client/home']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Registration failed';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}