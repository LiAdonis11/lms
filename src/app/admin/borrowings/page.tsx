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

  const activeBorrowings = borrowings.filter((b) => b.status !== 'returned');
  const returnedBorrowings = borrowings.filter((b) => b.status === 'returned');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'borrowed': return 'badge-default';
      case 'overdue': return 'badge-error';
      case 'returned': return 'badge-success';
      default: return 'badge-default';
    }
  };

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
              <h1 className="font-semibold text-lg">Manage Borrowings</h1>
              <p className="text-sm text-zinc-500">Issue and track book borrowings</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input w-auto py-2 text-sm"
            >
              <option value="">All Status</option>
              <option value="borrowed">Borrowed</option>
              <option value="overdue">Overdue</option>
              <option value="returned">Returned</option>
            </select>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-900/30 text-red-400 text-sm rounded-lg">
            {error}
          </div>
        )}

        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-zinc-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Active Borrowings</h2>
              {activeBorrowings.length > 0 && <span className="text-sm text-zinc-500 ml-2">({activeBorrowings.length})</span>}
            </div>
          </div>
          
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card p-6">
                  <div className="skeleton h-5 w-3/4 mb-2 rounded" />
                  <div className="skeleton h-4 w-1/2 mb-4 rounded" />
                  <div className="skeleton h-10 w-full rounded-lg" />
                </div>
              ))}
            </div>
          ) : activeBorrowings.length === 0 ? (
            <div className="card p-8 text-center">
              <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-zinc-500">No active borrowings</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeBorrowings.map((borrowing, index) => (
                <div key={borrowing.id} className={`card p-6 animate-fade-in stagger-${index + 1}`}>
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <span className={`badge ${getStatusBadge(borrowing.status)}`}>
                      {borrowing.status}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 line-clamp-1">{borrowing.title || 'Book'}</h3>
                  <p className="text-sm text-zinc-500 mb-5">{borrowing.author || 'Unknown Author'}</p>
                  
                  <div className="space-y-2 mb-5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">User ID</span>
                      <span className="text-zinc-400">#{borrowing.user_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Borrowed</span>
                      <span className="text-zinc-400">{borrowing.borrow_date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Due</span>
                      <span className={borrowing.status === 'overdue' ? 'text-red-400 font-medium' : 'text-zinc-400'}>
                        {borrowing.due_date}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleUpdate(borrowing.id, 'returned')}
                    disabled={updating === borrowing.id}
                    className="w-full btn-primary text-sm py-2.5"
                  >
                    {updating === borrowing.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Processing...
                      </span>
                    ) : 'Mark as Returned'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Returned Books</h2>
              {returnedBorrowings.length > 0 && <span className="text-sm text-zinc-500 ml-2">({returnedBorrowings.length})</span>}
            </div>
          </div>
          
          {returnedBorrowings.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-zinc-500">No returned books</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {returnedBorrowings.map((borrowing, index) => (
                <div key={borrowing.id} className={`card p-6 opacity-60 animate-fade-in stagger-${index + 1}`}>
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <span className="badge badge-success">Returned</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 line-clamp-1">{borrowing.title || 'Book'}</h3>
                  <p className="text-sm text-zinc-500 mb-5">{borrowing.author || 'Unknown Author'}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">User ID</span>
                      <span className="text-zinc-400">#{borrowing.user_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Borrowed</span>
                      <span className="text-zinc-400">{borrowing.borrow_date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Returned</span>
                      <span className="text-zinc-400">{borrowing.return_date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}