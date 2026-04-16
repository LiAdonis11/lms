import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonList, IonItem, IonLabel, IonInput } from '@ionic/angular/standalone';
import { ApiService, User } from '../../../services/api.service';

@Component({
  selector: 'app-profile',
  template: `
    <ion-content [fullscreen]="true">
      <ion-header>
        <ion-toolbar><ion-title>Profile</ion-title></ion-toolbar>
      </ion-header>

      <div class="page-content">
        <div class="profile-header">
          <div class="avatar">
            <ion-icon name="person-circle"></ion-icon>
          </div>
          <h2>{{ currentUser?.name }}</h2>
          <p>{{ currentUser?.email }}</p>
        </div>

        <form (ngSubmit)="updateProfile()">
          <ion-list lines="full">
            <ion-item>
              <ion-label position="stacked">Name</ion-label>
              <ion-input [(ngModel)]="formData.name" name="name"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">Email</ion-label>
              <ion-input [(ngModel)]="formData.email" name="email" type="email" disabled></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">Phone</ion-label>
              <ion-input [(ngModel)]="formData.phone" name="phone"></ion-input>
            </ion-item>
          </ion-list>

          <ion-button type="submit" expand="block" class="save-btn">Save Changes</ion-button>
        </form>

        <div class="logout-section">
          <ion-button expand="block" color="danger" fill="outline" (click)="logout()">
            <ion-icon slot="start" name="log-out"></ion-icon>
            Sign Out
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .page-content { padding: 16px; }
    .profile-header { text-align: center; margin-bottom: 32px; }
    .avatar ion-icon { font-size: 80px; color: var(--ion-color-primary); }
    .profile-header h2 { margin: 16px 0 4px; }
    .profile-header p { color: var(--ion-color-medium); margin: 0; }
    .save-btn { margin-top: 24px; --background: var(--ion-color-primary); }
    .logout-section { margin-top: 32px; }
  `],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonList, IonItem, IonLabel, IonInput]
})
export class ProfilePage implements OnInit {
  currentUser: User | null = null;
  formData: any = {};

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.api.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.formData = { ...user };
    });
  }

  updateProfile() {
    // Would call API to update profile
  }

  logout() {
    this.api.logout();
    this.router.navigate(['/login']);
  }
}