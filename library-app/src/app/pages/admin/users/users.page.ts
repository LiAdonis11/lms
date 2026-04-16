import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonButton, IonIcon, IonSearchbar, IonCard, IonList, IonItem, IonLabel, IonChip, IonModal, IonInput, IonTextarea, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { ApiService, User } from '../../../services/api.service';

@Component({
  selector: 'app-users',
  template: `
    <ion-content [fullscreen]="true">
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons>
          <ion-title>Users</ion-title>
          <ion-buttons slot="end">
            <ion-button (click)="presentAddModal()"><ion-icon slot="icon-only" name="add"></ion-icon></ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <div class="page-content">
        <ion-searchbar [(ngModel)]="searchQuery" (ionChange)="searchUsers()" placeholder="Search users..."></ion-searchbar>
        
        <ion-list lines="full">
          <ion-item *ngFor="let user of users">
            <ion-label>
              <h2>{{ user.name }}</h2>
              <p>{{ user.email }}</p>
            </ion-label>
            <ion-chip [color]="user.role === 'admin' ? 'warning' : 'medium'" slot="end">{{ user.role }}</ion-chip>
            <ion-button fill="clear" slot="end" (click)="editUser(user)">
              <ion-icon slot="icon-only" name="create"></ion-icon>
            </ion-button>
            <ion-button fill="clear" slot="end" color="danger" (click)="deleteUser(user)">
              <ion-icon slot="icon-only" name="trash"></ion-icon>
            </ion-button>
          </ion-item>
        </ion-list>

        <div class="empty" *ngIf="!users.length"><p>No users found</p></div>
      </div>

      <ion-modal [isOpen]="showModal" (didDismiss)="showModal = false">
        <ng-template>
          <ion-header><ion-toolbar>
            <ion-buttons slot="start"><ion-button (click)="showModal = false">Cancel</ion-button></ion-buttons>
            <ion-title>{{ editingUser ? 'Edit User' : 'Add User' }}</ion-title>
            <ion-buttons slot="end"><ion-button (click)="saveUser()" [disabled]="saving">Save</ion-button></ion-buttons>
          </ion-toolbar></ion-header>
          <ion-content>
            <form class="form">
              <ion-list lines="full">
                <ion-item><ion-label position="stacked">Name *</ion-label><ion-input [(ngModel)]="formData.name" name="name"></ion-input></ion-item>
                <ion-item><ion-label position="stacked">Email *</ion-label><ion-input [(ngModel)]="formData.email" name="email" type="email"></ion-input></ion-item>
                <ion-item><ion-label position="stacked">Password{{ editingUser ? ' (leave blank to keep)' : ' *' }}</ion-label><ion-input [(ngModel)]="formData.password" name="password" type="password"></ion-input></ion-item>
                <ion-item><ion-label position="stacked">Role</ion-label><ion-select [(ngModel)]="formData.role" name="role"><ion-select-option value="client">Client</ion-select-option><ion-select-option value="admin">Admin</ion-select-option></ion-select></ion-item>
                <ion-item><ion-label position="stacked">Phone</ion-label><ion-input [(ngModel)]="formData.phone" name="phone"></ion-input></ion-item>
              </ion-list>
            </form>
          </ion-content>
        </ng-template>
      </ion-modal>
    </ion-content>
  `,
  styles: [`.page-content { padding: 16px; } .empty { text-align: center; padding: 48px; color: var(--ion-color-medium); } .form { padding: 16px; }`],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonButton, IonIcon, IonSearchbar, IonCard, IonList, IonItem, IonLabel, IonChip, IonModal, IonInput, IonTextarea, IonSelect, IonSelectOption]
})
export class UsersPage implements OnInit {
  users: User[] = [];
  searchQuery = '';
  showModal = false;
  editingUser: User | null = null;
  saving = false;
  formData: any = {};

  constructor(private api: ApiService) {}

  ngOnInit() { this.loadUsers(); }

  loadUsers() {
    this.api.getUsers().subscribe(res => this.users = res.users || []);
  }

  searchUsers() {
    this.api.getUsers(this.searchQuery).subscribe(res => this.users = res.users || []);
  }

  presentAddModal() {
    this.editingUser = null;
    this.formData = { name: '', email: '', password: '', role: 'client', phone: '' };
    this.showModal = true;
  }

  editUser(user: User) {
    this.editingUser = user;
    this.formData = { ...user };
    this.showModal = true;
  }

  saveUser() {
    if (!this.formData.name || !this.formData.email) return;
    this.saving = true;
    const request = this.editingUser ? this.api.updateUser(this.editingUser.id, this.formData) : this.api.createUser(this.formData);
    request.subscribe({ next: () => { this.saving = false; this.showModal = false; this.loadUsers(); }, error: () => this.saving = false });
  }

  deleteUser(user: User) {
    this.api.deleteUser(user.id).subscribe({ next: () => this.loadUsers() });
  }
}