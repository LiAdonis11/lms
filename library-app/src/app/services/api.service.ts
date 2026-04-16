import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'client';
  phone?: string;
  address?: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  category?: string;
  cover_image?: string;
  total_copies: number;
  available_copies: number;
}

export interface Borrowing {
  id: number;
  user_id: number;
  book_id: number;
  borrow_date: string;
  due_date: string;
  return_date?: string;
  status: 'borrowed' | 'returned' | 'overdue';
  book?: Book;
  book_title?: string;
  book_author?: string;
  user_name?: string;
  user_email?: string;
}

export interface DashboardStats {
  total_books: number;
  total_users: number;
  active_borrowings: number;
  overdue_borrowings: number;
  available_books: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost/api';
  private tokenKey = 'library_token';
  private userKey = 'library_user';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem(this.tokenKey);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }

  get isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'admin';
  }

  loadStoredUser(): void {
    const token = localStorage.getItem(this.tokenKey);
    const userData = localStorage.getItem(this.userKey);
    if (token && userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem(this.tokenKey, res.token);
          localStorage.setItem(this.userKey, JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
        }
      })
    );
  }

  register(data: { name: string; email: string; password: string; phone?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem(this.tokenKey, res.token);
          localStorage.setItem(this.userKey, JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  getBooks(params?: { search?: string; category?: string }): Observable<any> {
    let url = `${this.apiUrl}/books`;
    const queryParams: string[] = [];
    if (params?.search) queryParams.push(`search=${params.search}`);
    if (params?.category) queryParams.push(`category=${params.category}`);
    if (queryParams.length) url += '?' + queryParams.join('&');
    return this.http.get(url, { headers: this.getHeaders() });
  }

  getBook(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/books/${id}`, { headers: this.getHeaders() });
  }

  createBook(book: Partial<Book>): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/books`, book, { headers: this.getHeaders() });
  }

  updateBook(id: number, book: Partial<Book>): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/books/${id}`, book, { headers: this.getHeaders() });
  }

  deleteBook(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/books/${id}`, { headers: this.getHeaders() });
  }

  getUsers(search?: string): Observable<any> {
    let url = `${this.apiUrl}/admin/users`;
    if (search) url += `?search=${search}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  getUser(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/users/${id}`, { headers: this.getHeaders() });
  }

  createUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/users`, user, { headers: this.getHeaders() });
  }

  updateUser(id: number, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/users/${id}`, user, { headers: this.getHeaders() });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/users/${id}`, { headers: this.getHeaders() });
  }

  getBorrowings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/borrowings`, { headers: this.getHeaders() });
  }

  getAdminBorrowings(status?: string): Observable<any> {
    let url = `${this.apiUrl}/admin/borrowings`;
    if (status) url += `?status=${status}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  borrowBook(bookId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/borrowings`, { book_id: bookId }, { headers: this.getHeaders() });
  }

  returnBook(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/borrowings/${id}`, { status: 'returned' }, { headers: this.getHeaders() });
  }

  getDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/dashboard`, { headers: this.getHeaders() });
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/categories`, { headers: this.getHeaders() });
  }
}