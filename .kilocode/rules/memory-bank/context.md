# Active Context: Library Management System

## Current State

**Project Status**: ✅ In Development

Library management system with Next.js frontend and PHP API backend.

## Recently Completed

- [x] Created API client (`src/lib/api.ts`) with all endpoints
- [x] Created AuthContext (`src/context/AuthContext.tsx`) for token management
- [x] Created login page (`src/app/login/page.tsx`)
- [x] Created register page (`src/app/register/page.tsx`)
- [x] Created dashboard page (`src/app/dashboard/page.tsx`)
- [x] Created books browsing page with search (`src/app/books/page.tsx`)
- [x] Created user borrowings page (`src/app/borrowings/page.tsx`)
- [x] Created admin books management (`src/app/admin/books/page.tsx`)
- [x] Created admin users management (`src/app/admin/users/page.tsx`)
- [x] Created admin borrowings management (`src/app/admin/borrowings/page.tsx`)
- [x] Updated root layout with AuthProvider

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/lib/api.ts` | API client | ✅ Complete |
| `src/context/AuthContext.tsx` | Auth state | ✅ Complete |
| `src/app/login/` | Login page | ✅ Complete |
| `src/app/register/` | Register page | ✅ Complete |
| `src/app/dashboard/` | Main dashboard | ✅ Complete |
| `src/app/books/` | Browse books | ✅ Complete |
| `src/app/borrowings/` | My borrowings | ✅ Complete |
| `src/app/admin/books/` | Manage books | ✅ Complete |
| `src/app/admin/users/` | Manage users | ✅ Complete |
| `src/app/admin/borrowings/` | Manage borrowings | ✅ Complete |

## User Roles

### Admin Features
- Add, edit, and delete books
- Manage users (add, edit, delete)
- Issue books (view all borrowings)
- Accept returned books (mark as returned)

### User Features
- Register and login
- Search for books
- Borrow available books
- Return borrowed books
- View borrowed books

## Session History

| Date | Changes |
|------|---------|
| Initial | PHP API already implemented |
| Now | Built Next.js frontend |

## Pending

- [ ] Test the full application flow
- [ ] Run typecheck and lint
- [ ] Deploy