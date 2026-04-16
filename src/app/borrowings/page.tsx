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
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
          <p className="text-zinc-500">Loading...</p>
        </div>
      </div>
    );
  }

  const activeBooks = borrowings.filter((b) => b.status !== 'returned');
  const returnedBooks = borrowings.filter((b) => b.status === 'returned');

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
              <h1 className="font-semibold text-lg">My Borrowings</h1>
              <p className="text-sm text-zinc-500">View and return your borrowed books</p>
            </div>
          </div>
          <a href="/dashboard" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
            Back to Dashboard
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-zinc-100 text-zinc-700 text-sm rounded-lg border border-zinc-200">
            {error}
          </div>
        )}

        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Active Borrowings</h2>
            {activeBooks.length > 0 && (
              <span className="badge badge-default">{activeBooks.length}</span>
            )}
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
            </div>
          ) : activeBooks.length === 0 ? (
            <div className="card p-8 text-center">
              <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-zinc-500">No active borrowings</p>
              <a href="/books" className="inline-block mt-4 text-sm font-medium text-zinc-900 hover:underline">
                Browse Books
              </a>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeBooks.map((borrowing, index) => (
                <div key={borrowing.id} className={`card p-6 animate-fade-in stagger-${(index % 5) + 1}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <span className={`badge ${borrowing.status === 'overdue' ? 'badge-error' : 'badge-warning'}`}>
                      {borrowing.status}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-1 line-clamp-1">{borrowing.title}</h3>
                  <p className="text-sm text-zinc-500 mb-4">{borrowing.author}</p>
                  
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Borrowed</span>
                      <span className="text-zinc-600">{borrowing.borrow_date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Due</span>
                      <span className={borrowing.status === 'overdue' ? 'text-red-600 font-medium' : 'text-zinc-600'}>
                        {borrowing.due_date}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleReturn(borrowing.id)}
                    disabled={returning === borrowing.id}
                    className="w-full btn-primary text-sm py-2.5"
                  >
                    {returning === borrowing.id ? 'Returning...' : 'Return Book'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-zinc-200 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Returned Books</h2>
            {returnedBooks.length > 0 && (
              <span className="badge badge-default">{returnedBooks.length}</span>
            )}
          </div>
          
          {returnedBooks.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-zinc-500">No returned books yet</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {returnedBooks.map((borrowing, index) => (
                <div key={borrowing.id} className={`card p-6 opacity-70 animate-fade-in stagger-${(index % 5) + 1}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <span className="badge badge-success">Returned</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-1 line-clamp-1">{borrowing.title}</h3>
                  <p className="text-sm text-zinc-500 mb-4">{borrowing.author}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Borrowed</span>
                      <span className="text-zinc-600">{borrowing.borrow_date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Returned</span>
                      <span className="text-zinc-600">{borrowing.return_date}</span>
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