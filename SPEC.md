# Library Management System - Specification

## 1. Project Overview

**Project Name:** LibraryMS  
**Type:** Fullstack Web Application (Mobile-first with Ionic Angular + PHP/MySQL)  
**Core Functionality:** A modern library management system allowing admins to manage books and users, while clients can browse, borrow, and return books.  
**Target Users:** Library administrators and library members/clients

---

## 2. Technology Stack

### Backend
- **Language:** PHP 8.x
- **Database:** MySQL
- **API:** RESTful JSON API
- **Structure:** Single entry point with route controllers

### Frontend
- **Framework:** Ionic Angular 7+
- **UI:** Ionic components with custom theming
- **HTTP:** Angular HttpClient
- **State:** Angular Services with RxJS

---

## 3. UI/UX Specification

### Color Palette
| Role | Color | Hex |
|------|-------|-----|
| Primary | Deep Indigo | `#1e1b4b` |
| Secondary | Warm Amber | `#f59e0b` |
| Accent | Teal | `#14b8a6` |
| Background | Off-white | `#fafafa` |
| Surface | White | `#ffffff` |
| Text Primary | Dark Slate | `#0f172a` |
| Text Secondary | Slate | `#64748b` |
| Success | Emerald | `#10b981` |
| Warning | Orange | `#f97316` |
| Error | Rose | `#e11d48` |

### Typography
- **Font Family:** "DM Sans" for body, "Playfair Display" for headings
- **Headings:** 24px (h1), 20px (h2), 18px (h3)
- **Body:** 14px regular, 16px for larger text
- **Weights:** 400 (regular), 500 (medium), 700 (bold)

### Layout & Spacing
- **Spacing Scale:** 4px base (4, 8, 12, 16, 24, 32, 48px)
- **Container:** max-width 1200px, centered
- **Cards:** 16px padding, 12px border-radius, subtle shadow
- **Buttons:** 8px vertical, 24px horizontal padding, 8px radius

### Visual Effects
- **Shadows:** `0 4px 6px -1px rgba(0,0,0,0.1)` for cards
- **Transitions:** 200ms ease for hover states
- **Animations:** Subtle fade-in for page transitions

### Responsive Breakpoints
- **Mobile:** < 768px (primary focus - Ionic mobile-first)
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

---

## 4. Database Schema

### Tables

```sql
-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'client') DEFAULT 'client',
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books table
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    description TEXT,
    category VARCHAR(100),
    cover_image VARCHAR(255),
    total_copies INT DEFAULT 1,
    available_copies INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Borrowings table
CREATE TABLE borrowings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    borrow_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE NULL,
    status ENUM('borrowed', 'returned', 'overdue') DEFAULT 'borrowed',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);
```

---

## 5. API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/register` | Register new client |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user |

### Books (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | List all books (with search/filter) |
| GET | `/api/books/:id` | Get book details |
| GET | `/api/books/categories` | Get all categories |

### Books (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/books` | Create new book |
| PUT | `/api/admin/books/:id` | Update book |
| DELETE | `/api/admin/books/:id` | Delete book |

### Users (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users |
| GET | `/api/admin/users/:id` | Get user details |
| POST | `/api/admin/users` | Create user |
| PUT | `/api/admin/users/:id` | Update user |
| DELETE | `/api/admin/users/:id` | Delete user |

### Borrowings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/borrowings` | User's borrowings |
| POST | `/api/borrowings` | Borrow a book |
| PUT | `/api/borrowings/:id/return` | Return a book |

### Borrowings (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/borrowings` | All borrowings |
| PUT | `/api/admin/borrowings/:id` | Update borrowing status |

### Dashboard (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard stats |

---

## 6. Pages & Components

### Login/Register Page
- Clean form with email/password
- Role selection (only for demo, normally assigned)
- Remember me option
- Error messages for invalid credentials

### Admin Layout
- Side menu with: Dashboard, Books, Users, Borrowings, Settings
- Header with user info and logout
- Main content area

### Client Layout
- Bottom tab navigation: Home, Browse, My Books, Profile
- Header with app title

### Admin Pages
1. **Dashboard:** Stats cards (total books, users, active borrowings, overdue)
2. **Books List:** Table with search, add/edit/delete actions
3. **Users List:** Table with search, add/edit/delete actions
4. **Borrowings:** Table with filter by status, return actions
5. **Settings:** Profile update, password change

### Client Pages
1. **Home:** Welcome message, quick stats, recent available books
2. **Browse:** Searchable book list with filters (category, availability)
3. **Book Detail:** Full book info, availability, borrow button
4. **My Books:** Current borrowed books, history
5. **Profile:** User info, password change

---

## 7. Functionality Specification

### Authentication
- JWT-based authentication
- Token stored in localStorage
- Auto-login on app reload if token valid
- Role-based route guards

### Book Management (Admin)
- CRUD operations for books
- Upload cover image (base64 or URL)
- Search by title, author, ISBN
- Filter by category
- View availability status

### User Management (Admin)
- CRUD operations for users
- View borrowing history
- Activate/deactivate users

### Borrowing Flow (Client)
1. Browse books → Select book → Click "Borrow"
2. System checks availability
3. If available: create borrowing record, decrease available copies
4. Due date set to 14 days from borrow date

### Return Flow
1. Client clicks "Return" on borrowed book
2. Admin can also process returns
3. Update return_date, status to 'returned'
4. Increase available copies

### Overdue Detection
- On dashboard load, check for overdue books
- Mark as overdue if return_date < today and not returned

---

## 8. Acceptance Criteria

### Visual
- [ ] Clean, minimalist design with specified colors
- [ ] Responsive on mobile and desktop
- [ ] Smooth page transitions
- [ ] Loading states for async operations
- [ ] Error messages displayed clearly

### Functionality
- [ ] Login/logout works for both roles
- [ ] Admin can manage books (CRUD)
- [ ] Admin can manage users (CRUD)
- [ ] Admin can view and manage borrowings
- [ ] Client can browse and search books
- [ ] Client can borrow available books
- [ ] Client can return borrowed books
- [ ] Dashboard shows correct statistics

### Technical
- [ ] API returns proper JSON responses
- [ ] Error handling with appropriate HTTP codes
- [ ] JWT authentication working
- [ ] No console errors on any page