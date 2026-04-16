'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getBooks, borrowBook, Book } from '@/lib/api';

export default function BooksPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [borrowing, setBorrowing] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await getBooks(search);
      setBooks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBooks();
    }
  }, [user, search]);

  const handleBorrow = async (bookId: number) => {
    setBorrowing(bookId);
    setError('');
    try {
      await borrowBook(bookId);
      await fetchBooks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to borrow book');
    } finally {
      setBorrowing(null);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 relative">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="w-10 h-10 border-2 border-zinc-800 border-t-zinc-100 rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 relative">
      <div className="absolute inset-0 dot-pattern opacity-10" />
      
      <header className="relative z-10 border-b border-zinc-800/50 backdrop-blur-xl sticky top-0">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="p-2 hover:bg-zinc-900 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </a>
            <div>
              <h1 className="font-semibold text-lg">Browse Books</h1>
              <p className="text-sm text-zinc-500">Find and borrow available books</p>
            </div>
          </div>
          <a href="/dashboard" className="btn-ghost text-sm">
            Back to Dashboard
          </a>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-12"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-900/30 text-red-400 text-sm rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="skeleton w-12 h-12 rounded-xl" />
                  <div className="skeleton w-16 h-5 rounded-full" />
                </div>
                <div className="skeleton h-5 w-3/4 mb-2 rounded" />
                <div className="skeleton h-4 w-1/2 mb-4 rounded" />
                <div className="flex gap-2 mb-4">
                  <div className="skeleton h-5 w-16 rounded" />
                  <div className="skeleton h-5 w-20 rounded" />
                </div>
                <div className="skeleton h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-zinc-500">No books found</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book, index) => (
              <div key={book.id} className={`card p-6 animate-fade-in stagger-${(index % 5) + 1}`}>
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <span className={`badge ${book.available_copies > 0 ? 'badge-default' : 'badge-error'}`}>
                    {book.available_copies > 0 ? 'Available' : 'Not Available'}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold mb-2 line-clamp-1">{book.title}</h3>
                <p className="text-sm text-zinc-500 mb-4">{book.author}</p>
                
                <div className="flex flex-wrap gap-2 mb-5">
                  {book.isbn && (
                    <span className="text-xs text-zinc-500 bg-zinc-900/50 px-2.5 py-1 rounded-lg border border-zinc-800">
                      ISBN: {book.isbn}
                    </span>
                  )}
                  {book.category && (
                    <span className="text-xs text-zinc-500 bg-zinc-900/50 px-2.5 py-1 rounded-lg border border-zinc-800">
                      {book.category}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                  <span className="text-sm text-zinc-500">
                    {book.available_copies} / {book.total_copies} copies
                  </span>
                  <button
                    onClick={() => handleBorrow(book.id)}
                    disabled={borrowing === book.id || book.available_copies <= 0}
                    className="btn-primary text-sm py-2 px-4"
                  >
                    {borrowing === book.id ? (
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Borrowing...
                      </span>
                    ) : book.available_copies <= 0 ? 'Unavailable' : 'Borrow'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}