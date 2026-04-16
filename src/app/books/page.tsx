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
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
          <p className="text-zinc-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="text-zinc-500 hover:text-zinc-900 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </a>
            <div>
              <h1 className="font-semibold text-lg">Browse Books</h1>
              <p className="text-sm text-zinc-500">Find and borrow available books</p>
            </div>
          </div>
          <a href="/dashboard" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
            Back to Dashboard
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <div className="mb-6 p-4 bg-zinc-100 text-zinc-700 text-sm rounded-lg border border-zinc-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-zinc-500">No books found</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book, index) => (
              <div key={book.id} className={`card p-6 animate-fade-in stagger-${(index % 5) + 1}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <span className={`badge ${book.available_copies > 0 ? 'badge-default' : 'badge-error'}`}>
                    {book.available_copies > 0 ? 'Available' : 'Not Available'}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold mb-1 line-clamp-1">{book.title}</h3>
                <p className="text-sm text-zinc-500 mb-3">{book.author}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {book.isbn && (
                    <span className="text-xs text-zinc-400 bg-zinc-50 px-2 py-1 rounded">
                      ISBN: {book.isbn}
                    </span>
                  )}
                  {book.category && (
                    <span className="text-xs text-zinc-400 bg-zinc-50 px-2 py-1 rounded">
                      {book.category}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                  <span className="text-sm text-zinc-500">
                    {book.available_copies} / {book.total_copies} copies
                  </span>
                  <button
                    onClick={() => handleBorrow(book.id)}
                    disabled={borrowing === book.id || book.available_copies <= 0}
                    className="btn-primary text-sm py-2 px-4"
                  >
                    {borrowing === book.id ? 'Borrowing...' : book.available_copies <= 0 ? 'Unavailable' : 'Borrow'}
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