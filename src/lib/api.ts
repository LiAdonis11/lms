const API_URL = '/api';

interface ApiError {
  error: string;
}

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string | null;
  description: string | null;
  category: string | null;
  cover_image: string | null;
  total_copies: number;
  available_copies: number;
  created_at: string;
}

interface Borrowing {
  id: number;
  user_id: number;
  book_id: number;
  borrow_date: string;
  due_date: string;
  return_date: string | null;
  status: 'borrowed' | 'overdue' | 'returned';
  title?: string;
  author?: string;
  borrowing_id?: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'client';
  phone: string | null;
  address: string | null;
  created_at: string;
  borrowings?: Borrowing[];
}

interface AuthResponse {
  token: string;
  user: User;
}

interface BooksResponse {
  books: Book[];
}

interface BookResponse {
  book: Book;
}

interface BorrowingsResponse {
  borrowings: Borrowing[];
}

interface BorrowingResponse {
  borrowing: Borrowing;
}

interface UsersResponse {
  users: User[];
}

interface UserResponse {
  user: User;
}

interface MessageResponse {
  message: string;
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

function getHeaders(): HeadersInit {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Login failed');
  }
  return data;
}

export async function register(name: string, email: string, password: string, phone?: string): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, phone }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Registration failed');
  }
  return data;
}

export async function getMe(): Promise<User> {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to get user');
  }
  return data.user;
}

export async function getBooks(search?: string, category?: string): Promise<Book[]> {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (category) params.set('category', category);
  const res = await fetch(`${API_URL}/books?${params}`, {
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to get books');
  }
  return data.books;
}

export async function getMyBorrowings(): Promise<Borrowing[]> {
  const res = await fetch(`${API_URL}/borrowings`, {
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to get borrowings');
  }
  return data.borrowings;
}

export async function borrowBook(bookId: number): Promise<Borrowing> {
  const res = await fetch(`${API_URL}/borrowings`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ book_id: bookId }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to borrow book');
  }
  return data.borrowing;
}

export async function returnBook(borrowingId: number): Promise<void> {
  const res = await fetch(`${API_URL}/borrowings`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ status: 'returned' }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to return book');
  }
}

export async function getUsers(): Promise<User[]> {
  const res = await fetch(`${API_URL}/admin/users`, {
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to get users');
  }
  return data.users;
}

export async function createUser(name: string, email: string, password: string, role: string, phone?: string): Promise<User> {
  const res = await fetch(`${API_URL}/admin/users`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ name, email, password, role, phone }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to create user');
  }
  return data.user;
}

export async function updateUser(id: number, data: Partial<User>): Promise<User> {
  const res = await fetch(`${API_URL}/admin/users/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  const resData = await res.json();
  if (!res.ok) {
    throw new Error(resData.error || 'Failed to update user');
  }
  return resData.user;
}

export async function deleteUser(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/admin/users/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete user');
  }
}

export async function getAdminBorrowings(status?: string): Promise<Borrowing[]> {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  const res = await fetch(`${API_URL}/borrowings?${params}`, {
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to get borrowings');
  }
  return data.borrowings;
}

export async function updateBorrowing(id: number, status: string): Promise<Borrowing> {
  const res = await fetch(`${API_URL}/admin/borrowings/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update borrowing');
  }
  return data.borrowing;
}

export async function createBook(book: Partial<Book>): Promise<Book> {
  const res = await fetch(`${API_URL}/admin/books`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(book),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to create book');
  }
  return data.book;
}

export async function updateBook(id: number, book: Partial<Book>): Promise<Book> {
  const res = await fetch(`${API_URL}/admin/books/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(book),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update book');
  }
  return data.book;
}

export async function deleteBook(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/admin/books/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete book');
  }
}

export type { Book, Borrowing, User, AuthResponse };