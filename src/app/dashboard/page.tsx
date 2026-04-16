'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const isAdmin = user.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Library Management</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user.name}</span>
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {user.role}
            </span>
            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <a
            href="/books"
            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold mb-2">Browse Books</h2>
            <p className="text-gray-600">Search and view available books</p>
          </a>

          <a
            href="/borrowings"
            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold mb-2">My Borrowings</h2>
            <p className="text-gray-600">View and return borrowed books</p>
          </a>

          {isAdmin && (
            <>
              <a
                href="/admin/books"
                className="p-6 bg-white rounded-lg shadow hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold mb-2">Manage Books</h2>
                <p className="text-gray-600">Add, edit, or delete books</p>
              </a>

              <a
                href="/admin/users"
                className="p-6 bg-white rounded-lg shadow hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold mb-2">Manage Users</h2>
                <p className="text-gray-600">View and manage user accounts</p>
              </a>

              <a
                href="/admin/borrowings"
                className="p-6 bg-white rounded-lg shadow hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold mb-2">Manage Borrowings</h2>
                <p className="text-gray-600">Issue and accept returned books</p>
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}