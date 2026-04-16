import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonButton, IonIcon, IonSearchbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel, IonChip, IonFab, IonFabButton, IonModal, IonItem, IonInput, IonTextarea, IonSelectOption, IonSelect, IonList, IonNote } from '@ionic/angular/standalone';
import { ApiService, Book } from '../../../services/api.service';

@Component({
  selector: 'app-books',
  template: `
    <ion-content [fullscreen]="true">
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>Books</ion-title>
          <ion-buttons slot="end">
            <ion-button (click)="presentAddModal()">
              <ion-icon slot="icon-only" name="add"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <div class="page-content">
        <ion-searchbar [(ngModel)]="searchQuery" (ionChange)="searchBooks()" placeholder="Search books..."></ion-searchbar>
        
        <div class="books-grid" *ngIf="books.length">
          <ion-card *ngFor="let book of books" class="book-card">
            <div class="book-cover">
              <img [src]="book.cover_image || 'https://via.placeholder.com/120x180?text=No+Cover'" [alt]="book.title">
            </div>
            <ion-card-content>
              <h3 class="book-title">{{ book.title }}</h3>
              <p class="book-author">{{ book.author }}</p>
              <ion-chip [color]="book.available_copies > 0 ? 'success' : 'danger'" class="availability-chip">
                {{ book.available_copies }}/{{ book.total_copies }} available
              </ion-chip>
              <div class="book-actions">
                <ion-button fill="clear" size="small" (click)="editBook(book)">
                  <ion-icon slot="icon-only" name="create"></ion-icon>
                </ion-button>
                <ion-button fill="clear" size="small" color="danger" (click)="deleteBook(book)">
                  <ion-icon slot="icon-only" name="trash"></ion-icon>
                </ion-button>
              </div>
            </ion-card-content>
          </ion-card>
        </div>

        <div class="empty-state" *ngIf="!books.length && !loading">
          <ion-icon name="book-outline"></ion-icon>
          <p>No books found</p>
        </div>
      </div>

      <ion-modal [isOpen]="showModal" (didDismiss)="showModal = false">
        <ng-template>
          <ion-header>
            <ion-toolbar>
              <ion-buttons slot="start">
                <ion-button (click)="showModal = false">Cancel</ion-button>
              </ion-buttons>
              <ion-title>{{ editingBook ? 'Edit Book' : 'Add Book' }}</ion-title>
              <ion-buttons slot="end">
                <ion-button (click)="saveBook()" [disabled]="saving">Save</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content>
            <form class="book-form">
              <ion-list lines="full">
                <ion-item>
                  <ion-label position="stacked">Title *</ion-label>
                  <ion-input [(ngModel)]="formData.title" name="title" required></ion-input>
                </ion-item>
                <ion-item>
                  <ion-label position="stacked">Author *</ion-label>
                  <ion-input [(ngModel)]="formData.author" name="author" required></ion-input>
                </ion-item>
                <ion-item>
                  <ion-label position="stacked">ISBN</ion-label>
                  <ion-input [(ngModel)]="formData.isbn" name="isbn"></ion-input>
                </ion-item>
                <ion-item>
                  <ion-label position="stacked">Category</ion-label>
                  <ion-input [(ngModel)]="formData.category" name="category"></ion-input>
                </ion-item>
                <ion-item>
                  <ion-label position="stacked">Cover Image URL</ion-label>
                  <ion-input [(ngModel)]="formData.cover_image" name="cover_image"></ion-input>
                </ion-item>
                <ion-item>
                  <ion-label position="stacked">Description</ion-label>
                  <ion-textarea [(ngModel)]="formData.description" name="description" rows="3"></ion-textarea>
                </ion-item>
                <ion-item>
                  <ion-label position="stacked">Total Copies</ion-label>
                  <ion-input type="number" [(ngModel)]="formData.total_copies" name="total_copies"></ion-input>
                </ion-item>
              </ion-list>
            </form>
          </ion-content>
        </ng-template>
      </ion-modal>
    </ion-content>
  `,
  styles: [`
    .page-content {
      padding: 16px;
    }
    .books-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 16px;
    }
    .book-card {
      margin: 0;
    }
    .book-cover {
      height: 180px;
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
      font-size: 14px;
      font-weight: 600;
      margin: 0 0 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .book-author {
      font-size: 12px;
      color: var(--ion-color-medium);
      margin: 0 0 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .availability-chip {
      font-size: 11px;
      height: 24px;
    }
    .book-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 8px;
    }
    .empty-state {
      text-align: center;
      padding: 48px;
      color: var(--ion-color-medium);
    }
    .empty-state ion-icon {
      font-size: 64px;
    }
    .book-form {
      padding: 16px;
    }
  `],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonButton, IonIcon, IonSearchbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel, IonChip, IonFab, IonFabButton, IonModal, IonItem, IonInput, IonTextarea, IonSelectOption, IonSelect, IonList, IonNote]
})
export class BooksPage implements OnInit {
  books: Book[] = [];
  searchQuery = '';
  showModal = false;
  editingBook: Book | null = null;
  saving = false;
  loading = false;
  formData: Partial<Book> = {};

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

  presentAddModal() {
    this.editingBook = null;
    this.formData = { title: '', author: '', isbn: '', category: '', description: '', cover_image: '', total_copies: 1 };
    this.showModal = true;
  }

  editBook(book: Book) {
    this.editingBook = book;
    this.formData = { ...book };
    this.showModal = true;
  }

  saveBook() {
    if (!this.formData.title || !this.formData.author) return;
    this.saving = true;
    
    const request = this.editingBook 
      ? this.api.updateBook(this.editingBook.id, this.formData)
      : this.api.createBook(this.formData);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.showModal = false;
        this.loadBooks();
      },
      error: () => { this.saving = false; }
    });
  }

  deleteBook(book: Book) {
    this.api.deleteBook(book.id).subscribe({
      next: () => this.loadBooks()
    });
  }
}