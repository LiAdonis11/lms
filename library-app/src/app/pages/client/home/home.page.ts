import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, IonCard, IonCardContent, IonCardHeader, IonButton, IonIcon, IonChip, IonLabel, IonBadge, IonInfiniteScroll, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { ApiService, Book } from '../../../services/api.service';

@Component({
  selector: 'app-client-home',
  template: `
    <ion-content [fullscreen]="true">
      <ion-header>
        <ion-toolbar>
          <ion-title>Library</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="page-content">
        <ion-refresher slot="fixed" (ionRefresh)="refresh($event)">
          <ion-refresher-content></ion-refresher-content>
        </ion-refresher>

        <div class="welcome-section">
          <h2>Welcome back!</h2>
          <p>Discover your next great read</p>
        </div>

        <ion-searchbar [(ngModel)]="searchQuery" (ionChange)="searchBooks()" placeholder="Search books..."></ion-searchbar>

        <div class="books-grid" *ngIf="books.length">
          <ion-card *ngFor="let book of books" class="book-card">
            <div class="book-cover">
              <img [src]="book.cover_image || 'https://via.placeholder.com/120x180?text=No+Cover'" [alt]="book.title">
            </div>
            <ion-card-content>
              <h3 class="book-title">{{ book.title }}</h3>
              <p class="book-author">{{ book.author }}</p>
              <ion-chip [color]="book.available_copies > 0 ? 'success' : 'danger'" size="small">
                {{ book.available_copies > 0 ? 'Available' : 'Unavailable' }}
              </ion-chip>
              <ion-button expand="block" size="small" [disabled]="book.available_copies <= 0" (click)="borrowBook(book)">
                <ion-icon slot="start" name="book"></ion-icon>
                Borrow
              </ion-button>
            </ion-card-content>
          </ion-card>
        </div>

        <div class="empty-state" *ngIf="!books.length && !loading">
          <ion-icon name="search-outline"></ion-icon>
          <p>No books found</p>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .page-content {
      padding: 16px;
    }
    .welcome-section {
      margin-bottom: 16px;
    }
    .welcome-section h2 {
      font-size: 24px;
      margin: 0;
    }
    .welcome-section p {
      color: var(--ion-color-medium);
      margin: 4px 0 0;
    }
    .books-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .book-card {
      margin: 0;
    }
    .book-cover {
      height: 140px;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .book-cover img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .book-title {
      font-size: 13px;
      font-weight: 600;
      margin: 0 0 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .book-author {
      font-size: 11px;
      color: var(--ion-color-medium);
      margin: 0 0 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    ion-button {
      margin-top: 8px;
      --background: var(--ion-color-primary);
    }
    .empty-state {
      text-align: center;
      padding: 48px;
      color: var(--ion-color-medium);
    }
    .empty-state ion-icon {
      font-size: 64px;
    }
  `],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, IonCard, IonCardContent, IonCardHeader, IonButton, IonIcon, IonChip, IonLabel, IonBadge, IonInfiniteScroll, IonRefresher, IonRefresherContent]
})
export class ClientHomePage implements OnInit {
  books: Book[] = [];
  searchQuery = '';
  loading = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.loading = true;
    this.api.getBooks().subscribe({
      next: (res) => { this.books = res.books || []; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  searchBooks() {
    this.loading = true;
    this.api.getBooks({ search: this.searchQuery }).subscribe({
      next: (res) => { this.books = res.books || []; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  refresh(event: any) {
    this.loadBooks();
    event.target.complete();
  }

  borrowBook(book: Book) {
    this.api.borrowBook(book.id).subscribe({
      next: () => {
        book.available_copies--;
      }
    });
  }
}