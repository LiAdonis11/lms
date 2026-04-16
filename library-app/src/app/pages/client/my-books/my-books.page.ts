import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonList, IonItem, IonLabel, IonChip } from '@ionic/angular/standalone';
import { ApiService, Borrowing } from '../../../services/api.service';

@Component({
  selector: 'app-my-books',
  template: `
    <ion-content [fullscreen]="true">
      <ion-header>
        <ion-toolbar><ion-title>My Books</ion-title></ion-toolbar>
      </ion-header>

      <div class="page-content">
        <ion-list lines="full">
          <ion-item *ngFor="let b of borrowings">
            <ion-label>
              <h2>{{ b.book_title }}</h2>
              <p>Author: {{ b.book_author }}</p>
              <p class="dates">Due: {{ b.due_date | date:'mediumDate' }}</p>
            </ion-label>
            <ion-chip [color]="b.status === 'returned' ? 'success' : (b.status === 'overdue' ? 'danger' : 'warning')" slot="end">
              {{ b.status }}
            </ion-chip>
            <ion-button slot="end" *ngIf="b.status !== 'returned'" fill="clear" (click)="returnBook(b)">
              <ion-icon slot="icon-only" name="return-right"></ion-icon> Return
            </ion-button>
          </ion-item>
        </ion-list>

        <div class="empty" *ngIf="!borrowings.length">
          <ion-icon name="book-outline"></ion-icon>
          <p>No borrowed books</p>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`.page-content { padding: 16px; } .dates { font-size: 12px; color: var(--ion-color-medium); } .empty { text-align: center; padding: 48px; color: var(--ion-color-medium); } .empty ion-icon { font-size: 64px; }`],
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonList, IonItem, IonLabel, IonChip]
})
export class MyBooksPage implements OnInit {
  borrowings: Borrowing[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() { this.loadBorrowings(); }

  loadBorrowings() {
    this.api.getBorrowings().subscribe(res => this.borrowings = res.borrowings || []);
  }

  returnBook(b: Borrowing) {
    this.api.returnBook(b.id).subscribe({ next: () => this.loadBorrowings() });
  }
}