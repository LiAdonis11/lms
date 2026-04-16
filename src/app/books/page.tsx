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
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="text-blue-600 hover:underline">
              Dashboard
            </a>
            <span className="text-gray-500">/</span>
            <span className="font-medium">Books</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search books by title, author, or ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded">{error}</div>
        )}

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : books.length === 0 ? (
          <div className="text-center py-8 text-gray-600">No books found</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <div key={book.id} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">{book.title}</h3>
                <p className="text-gray-600 mb-1">by {book.author}</p>
                {book.isbn && (
                  <p className="text-sm text-gray-500 mb-2">ISBN: {book.isbn}</p>
                )}
                {book.category && (
                  <p className="text-sm text-gray-500 mb-2">
                    Category: {book.category}
                  </p>
                )}
                <div className="flex justify-between items-center mt-4">
                  <span
                    className={`text-sm ${
                      book.available_copies > 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {book.available_copies} / {book.total_copies} available
                  </span>
                  <button
                    onClick={() => handleBorrow(book.id)}
                    disabled={borrowing === book.id || book.available_copies <= 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {borrowing === book.id
                      ? 'Borrowing...'
                      : book.available_copies <= 0
                      ? 'Not Available'
                      : 'Borrow'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}