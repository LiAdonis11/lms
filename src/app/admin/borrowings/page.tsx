'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getAdminBorrowings, updateBorrowing, Borrowing } from '@/lib/api';

export default function AdminBorrowingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const fetchBorrowings = async () => {
    setLoading(true);
    try {
      const data = await getAdminBorrowings(filter || undefined);
      setBorrowings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load borrowings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchBorrowings();
    }
  }, [user, filter]);

  const handleUpdate = async (id: number, status: string) => {
    setUpdating(id);
    setError('');
    try {
      await updateBorrowing(id, status);
      await fetchBorrowings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update borrowing');
    } finally {
      setUpdating(null);
    }
  };

  if (authLoading || !user || user.role !== 'admin') {
    return <div className="p-8">Loading...</div>;
  }

  const activeBorrowings = borrowings.filter((b) => b.status !== 'returned');
  const returnedBorrowings = borrowings.filter((b) => b.status === 'returned');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'borrowed':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'returned':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="text-blue-600 hover:underline">
              Dashboard
            </a>
            <span className="text-gray-500">/</span>
            <span className="font-medium">Manage Borrowings</span>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded"
          >
            <option value="">All</option>
            <option value="borrowed">Borrowed</option>
            <option value="overdue">Overdue</option>
            <option value="returned">Returned</option>
          </select>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded">{error}</div>
        )}

        <h2 className="text-xl font-semibold mb-4">Active Borrowings</h2>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : activeBorrowings.length === 0 ? (
          <div className="text-center py-8 text-gray-600 mb-8">No active borrowings</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {activeBorrowings.map((borrowing) => (
              <div key={borrowing.id} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">
                  {borrowing.title || 'Book'}
                </h3>
                <p className="text-gray-600 mb-1">
                  {borrowing.author || 'Unknown Author'}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  User: {borrowing.user_id}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  Borrowed: {borrowing.borrow_date}
                </p>
                <p className="text-sm text-gray-500 mb-2">Due: {borrowing.due_date}</p>
                <span
                  className={`inline-block text-sm px-2 py-1 rounded mb-4 ${getStatusColor(
                    borrowing.status
                  )}`}
                >
                  {borrowing.status}
                </span>
                <div>
                  <button
                    onClick={() => handleUpdate(borrowing.id, 'returned')}
                    disabled={updating === borrowing.id}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {updating === borrowing.id
                      ? 'Processing...'
                      : 'Mark as Returned'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 className="text-xl font-semibold mb-4">Returned Books</h2>
        {returnedBorrowings.length === 0 ? (
          <div className="text-center py-8 text-gray-600">No returned books</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {returnedBorrowings.map((borrowing) => (
              <div key={borrowing.id} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">
                  {borrowing.title || 'Book'}
                </h3>
                <p className="text-gray-600 mb-1">
                  {borrowing.author || 'Unknown Author'}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  User: {borrowing.user_id}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  Borrowed: {borrowing.borrow_date}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Returned: {borrowing.return_date}
                </p>
                <span
                  className={`inline-block text-sm px-2 py-1 rounded ${getStatusColor(
                    borrowing.status
                  )}`}
                >
                  {borrowing.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}