import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonIcon, IonLabel, IonMenuToggle, IonButton } from '@ionic/angular/standalone';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
      <ion-menu *ngIf="isAuthenticated" type="overlay" [contentId]="'main'">
        <ion-header>
          <ion-toolbar>
            <ion-title>Library</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list>
            <ng-container *ngIf="isAdmin">
              <ion-menu-toggle auto-hide="false">
                <ion-item button routerLink="/admin/dashboard" routerDirection="root">
                  <ion-icon slot="start" name="home"></ion-icon>
                  <ion-label>Dashboard</ion-label>
                </ion-item>
              </ion-menu-toggle>
              <ion-menu-toggle auto-hide="false">
                <ion-item button routerLink="/admin/books" routerDirection="root">
                  <ion-icon slot="start" name="book"></ion-icon>
                  <ion-label>Books</ion-label>
                </ion-item>
              </ion-menu-toggle>
              <ion-menu-toggle auto-hide="false">
                <ion-item button routerLink="/admin/users" routerDirection="root">
                  <ion-icon slot="start" name="people"></ion-icon>
                  <ion-label>Users</ion-label>
                </ion-item>
              </ion-menu-toggle>
              <ion-menu-toggle auto-hide="false">
                <ion-item button routerLink="/admin/borrowings" routerDirection="root">
                  <ion-icon slot="start" name="swap-horizontal"></ion-icon>
                  <ion-label>Borrowings</ion-label>
                </ion-item>
              </ion-menu-toggle>
            </ng-container>
            <ng-container *ngIf="!isAdmin">
              <ion-menu-toggle auto-hide="false">
                <ion-item button routerLink="/client/home" routerDirection="root">
                  <ion-icon slot="start" name="home"></ion-icon>
                  <ion-label>Home</ion-label>
                </ion-item>
              </ion-menu-toggle>
              <ion-menu-toggle auto-hide="false">
                <ion-item button routerLink="/client/my-books" routerDirection="root">
                  <ion-icon slot="start" name="book"></ion-icon>
                  <ion-label>My Books</ion-label>
                </ion-item>
              </ion-menu-toggle>
              <ion-menu-toggle auto-hide="false">
                <ion-item button routerLink="/client/profile" routerDirection="root">
                  <ion-icon slot="start" name="person"></ion-icon>
                  <ion-label>Profile</ion-label>
                </ion-item>
              </ion-menu-toggle>
            </ng-container>
            <ion-menu-toggle auto-hide="false">
              <ion-item button (click)="logout()">
                <ion-icon slot="start" name="log-out"></ion-icon>
                <ion-label>Sign Out</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>
        </ion-content>
      </ion-menu>
      
      <ion-router-outlet id="main"></ion-router-outlet>
    </ion-app>
  `,
  standalone: true,
  imports: [IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonIcon, IonLabel, IonMenuToggle, IonButton]
})
export class AppComponent implements OnInit {
  isAuthenticated = false;
  isAdmin = false;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.api.loadStoredUser();
    this.api.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.isAdmin = user?.role === 'admin';
    });
  }

  logout() {
    this.api.logout();
    this.router.navigate(['/login']);
  }
}