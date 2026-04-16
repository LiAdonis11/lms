import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonButton, IonIcon, IonLabel, IonBadge, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { ApiService, DashboardStats } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <ion-content [fullscreen]="true">
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>Dashboard</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="dashboard-content">
        <div class="stats-grid">
          <ion-card class="stat-card" routerLink="/admin/books">
            <ion-card-content>
              <div class="stat-icon books">
                <ion-icon name="book"></ion-icon>
              </div>
              <div class="stat-info">
                <ion-card-title>{{ stats?.total_books || 0 }}</ion-card-title>
                <ion-card-subtitle>Total Books</ion-card-subtitle>
              </div>
            </ion-card-content>
          </ion-card>

          <ion-card class="stat-card" routerLink="/admin/users">
            <ion-card-content>
              <div class="stat-icon users">
                <ion-icon name="people"></ion-icon>
              </div>
              <div class="stat-info">
                <ion-card-title>{{ stats?.total_users || 0 }}</ion-card-title>
                <ion-card-subtitle>Total Users</ion-card-subtitle>
              </div>
            </ion-card-content>
          </ion-card>

          <ion-card class="stat-card" routerLink="/admin/borrowings">
            <ion-card-content>
              <div class="stat-icon active">
                <ion-icon name="swap-horizontal"></ion-icon>
              </div>
              <div class="stat-info">
                <ion-card-title>{{ stats?.active_borrowings || 0 }}</ion-card-title>
                <ion-card-subtitle>Active Loans</ion-card-subtitle>
              </div>
            </ion-card-content>
          </ion-card>

          <ion-card class="stat-card overdue" routerLink="/admin/borrowings">
            <ion-card-content>
              <div class="stat-icon overdue">
                <ion-icon name="warning"></ion-icon>
              </div>
              <div class="stat-info">
                <ion-card-title>{{ stats?.overdue_borrowings || 0 }}</ion-card-title>
                <ion-card-subtitle>Overdue</ion-card-subtitle>
              </div>
            </ion-card-content>
          </ion-card>
        </div>

        <div class="quick-actions">
          <h3>Quick Actions</h3>
          <div class="actions-grid">
            <ion-button expand="block" routerLink="/admin/books" class="action-btn">
              <ion-icon slot="start" name="add-circle"></ion-icon>
              Add Book
            </ion-button>
            <ion-button expand="block" routerLink="/admin/users" class="action-btn">
              <ion-icon slot="start" name="person-add"></ion-icon>
              Add User
            </ion-button>
            <ion-button expand="block" routerLink="/admin/borrowings" class="action-btn">
              <ion-icon slot="start" name="list"></ion-icon>
              View All Loans
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .dashboard-content {
      padding: 16px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .stat-card {
      --background: var(--ion-card-background);
      margin: 0;
      cursor: pointer;
    }
    .stat-card ion-card-content {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
    }
    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .stat-icon ion-icon {
      font-size: 24px;
      color: white;
    }
    .stat-icon.books {
      background: var(--ion-color-primary);
    }
    .stat-icon.users {
      background: var(--ion-color-tertiary);
    }
    .stat-icon.active {
      background: var(--ion-color-success);
    }
    .stat-icon.overdue {
      background: var(--ion-color-warning);
    }
    .stat-info ion-card-title {
      font-size: 24px;
      font-weight: 700;
      margin: 0;
    }
    .stat-info ion-card-subtitle {
      font-size: 12px;
      color: var(--ion-color-medium);
      margin: 4px 0 0;
    }
    .quick-actions {
      margin-top: 32px;
    }
    .quick-actions h3 {
      font-size: 18px;
      margin: 0 0 16px;
    }
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    .action-btn {
      --background: var(--ion-color-light);
      --color: var(--ion-text-color);
      height: 60px;
    }
  `],
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonButton, IonIcon, IonLabel, IonBadge]
})
export class DashboardPage implements OnInit {
  stats: DashboardStats | null = null;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.api.getDashboard().subscribe({
      next: (res) => {
        this.stats = res.stats;
      },
      error: () => {
        this.stats = { total_books: 10, total_users: 2, active_borrowings: 0, overdue_borrowings: 0, available_books: 10 };
      }
    });
  }
}