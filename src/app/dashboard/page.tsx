'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { href: '/books', label: 'Browse Books', icon: '📚', desc: 'Search and view available books' },
  { href: '/borrowings', label: 'My Borrowings', icon: '📖', desc: 'View and return borrowed books' },
  { href: '/admin/books', label: 'Manage Books', icon: '✏️', desc: 'Add, edit, or delete books', admin: true },
  { href: '/admin/users', label: 'Manage Users', icon: '👥', desc: 'View and manage user accounts', admin: true },
  { href: '/admin/borrowings', label: 'Manage Borrowings', icon: '📋', desc: 'Issue and accept returned books', admin: true },
];

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
          <p className="text-zinc-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isAdmin = user.role === 'admin';
  const visibleItems = navItems.filter(item => !item.admin || isAdmin);

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-lg">L</span>
            </div>
            <span className="font-semibold text-xl tracking-tight">Library</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-zinc-500 capitalize">{user.role}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10 animate-fade-in">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            Good {getGreeting()}, {user.name.split(' ')[0]}
          </h1>
          <p className="text-zinc-500">What would you like to do today?</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              className={`card p-6 group animate-fade-in stagger-${index + 1}`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-2xl">{item.icon}</span>
                <svg 
                  className="w-5 h-5 text-zinc-400 group-hover:text-zinc-900 transition-colors" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold mb-1">{item.label}</h2>
              <p className="text-sm text-zinc-500">{item.desc}</p>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}