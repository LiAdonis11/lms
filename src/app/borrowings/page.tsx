'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getMyBorrowings, returnBook, Borrowing } from '@/lib/api';

export default function BorrowingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [returning, setReturning] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const fetchBorrowings = async () => {
    setLoading(true);
    try {
      const data = await getMyBorrowings();
      setBorrowings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load borrowings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBorrowings();
    }
  }, [user]);

  const handleReturn = async (borrowingId: number) => {
    setReturning(borrowingId);
    setError('');
    try {
      await returnBook(borrowingId);
      await fetchBorrowings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to return book');
    } finally {
      setReturning(null);
    }
  };

  if (authLoading || !user) {
    return <div className="p-8">Loading...</div>;
  }

  const activeBooks = borrowings.filter((b) => b.status !== 'returned');
  const returnedBooks = borrowings.filter((b) => b.status === 'returned');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="text-blue-600 hover:underline">
              Dashboard
            </a>
            <span className="text-gray-500">/</span>
            <span className="font-medium">My Borrowings</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded">{error}</div>
        )}

        <h2 className="text-xl font-semibold mb-4">Active Borrowings</h2>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : activeBooks.length === 0 ? (
          <div className="text-center py-8 text-gray-600 mb-8">
            No active borrowings
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {activeBooks.map((borrowing) => (
              <div key={borrowing.id} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">{borrowing.title}</h3>
                <p className="text-gray-600 mb-1">by {borrowing.author}</p>
                <p className="text-sm text-gray-500 mb-2">
                  Borrowed: {borrowing.borrow_date}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Due: {borrowing.due_date}
                </p>
                <span
                  className={`inline-block text-sm px-2 py-1 rounded mb-4 ${
                    borrowing.status === 'overdue'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {borrowing.status}
                </span>
                <div>
                  <button
                    onClick={() => handleReturn(borrowing.id)}
                    disabled={returning === borrowing.id}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {returning === borrowing.id ? 'Returning...' : 'Return Book'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 className="text-xl font-semibold mb-4">Returned Books</h2>
        {returnedBooks.length === 0 ? (
          <div className="text-center py-8 text-gray-600">No returned books</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {returnedBooks.map((borrowing) => (
              <div key={borrowing.id} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">{borrowing.title}</h3>
                <p className="text-gray-600 mb-1">by {borrowing.author}</p>
                <p className="text-sm text-gray-500 mb-2">
                  Borrowed: {borrowing.borrow_date}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Returned: {borrowing.return_date}
                </p>
                <span className="inline-block text-sm px-2 py-1 rounded bg-green-100 text-green-800">
                  returned
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}