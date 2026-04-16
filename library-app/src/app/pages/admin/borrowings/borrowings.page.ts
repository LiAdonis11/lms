import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonButton, IonIcon, IonSegment, IonSegmentButton, IonLabel, IonList, IonItem, IonChip, IonBadge } from '@ionic/angular/standalone';
import { ApiService, Borrowing } from '../../../services/api.service';

@Component({
  selector: 'app-borrowings',
  template: `
    <ion-content [fullscreen]="true">
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons>
          <ion-title>Borrowings</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="page-content">
        <ion-segment [(ngModel)]="filter" (ionChange)="filterChanged()">
          <ion-segment-button value=""><ion-label>All</ion-label></ion-segment-button>
          <ion-segment-button value="borrowed"><ion-label>Active</ion-label></ion-segment-button>
          <ion-segment-button value="overdue"><ion-label>Overdue</ion-label></ion-segment-button>
          <ion-segment-button value="returned"><ion-label>Returned</ion-label></ion-segment-button>
        </ion-segment>

        <ion-list lines="full">
          <ion-item *ngFor="let b of borrowings">
            <ion-label>
              <h2>{{ b.book_title }}</h2>
              <p>{{ b.user_name }} ({{ b.user_email }})</p>
              <p class="dates">
                Borrowed: {{ b.borrow_date | date:'mediumDate' }} | Due: {{ b.due_date | date:'mediumDate' }}
              </p>
            </ion-label>
            <ion-chip [color]="getStatusColor(b.status)" slot="end">{{ b.status }}</ion-chip>
            <ion-button slot="end" *ngIf="b.status !== 'returned'" fill="clear" (click)="returnBook(b)">
              <ion-icon slot="icon-only" name="checkmark-circle"></ion-icon>
            </ion-button>
          </ion-item>
        </ion-list>

        <div class="empty" *ngIf="!borrowings.length"><p>No borrowings found</p></div>
      </div>
    </ion-content>
  `,
  styles: [`.page-content { padding: 16px; } .dates { font-size: 12px; color: var(--ion-color-medium); } .empty { text-align: center; padding: 48px; color: var(--ion-color-medium); }`],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonButton, IonIcon, IonSegment, IonSegmentButton, IonLabel, IonList, IonItem, IonChip, IonBadge]
})
export class BorrowingsPage implements OnInit {
  borrowings: Borrowing[] = [];
  filter = '';

  constructor(private api: ApiService) {}

  ngOnInit() { this.loadBorrowings(); }

  loadBorrowings() {
    this.api.getAdminBorrowings(this.filter || undefined).subscribe(res => this.borrowings = res.borrowings || []);
  }

  filterChanged() { this.loadBorrowings(); }

  getStatusColor(status: string): string {
    if (status === 'overdue') return 'danger';
    if (status === 'returned') return 'success';
    return 'warning';
  }

  returnBook(b: Borrowing) {
    this.api.returnBook(b.id).subscribe({ next: () => this.loadBorrowings() });
  }
}