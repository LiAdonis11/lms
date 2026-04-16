import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage) },
  { path: 'register', loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage) },
  {
    path: 'admin',
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/admin/dashboard/dashboard.page').then(m => m.DashboardPage) },
      { path: 'books', loadComponent: () => import('./pages/admin/books/books.page').then(m => m.BooksPage) },
      { path: 'users', loadComponent: () => import('./pages/admin/users/users.page').then(m => m.UsersPage) },
      { path: 'borrowings', loadComponent: () => import('./pages/admin/borrowings/borrowings.page').then(m => m.BorrowingsPage) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'client',
    children: [
      { path: 'home', loadComponent: () => import('./pages/client/home/home.page').then(m => m.ClientHomePage) },
      { path: 'my-books', loadComponent: () => import('./pages/client/my-books/my-books.page').then(m => m.MyBooksPage) },
      { path: 'profile', loadComponent: () => import('./pages/client/profile/profile.page').then(m => m.ProfilePage) },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }