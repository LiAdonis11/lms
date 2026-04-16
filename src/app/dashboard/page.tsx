'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { href: '/books', label: 'Browse Books', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', desc: 'Search and view available books' },
  { href: '/borrowings', label: 'My Borrowings', icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z', desc: 'View and return borrowed books' },
  { href: '/admin/books', label: 'Manage Books', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', desc: 'Add, edit, or delete books', admin: true },
  { href: '/admin/users', label: 'Manage Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', desc: 'View and manage user accounts', admin: true },
  { href: '/admin/borrowings', label: 'Manage Borrowings', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', desc: 'Issue and accept returned books', admin: true },
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
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 relative">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="w-10 h-10 border-2 border-zinc-800 border-t-zinc-100 rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm">Loading...</p>
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
    <div className="min-h-screen bg-zinc-950 relative">
      <div className="absolute inset-0 dot-pattern opacity-10" />
      
      <header className="relative z-10 border-b border-zinc-800/50 backdrop-blur-xl sticky top-0">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-zinc-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <span className="font-semibold text-lg tracking-tight">Library</span>
              <p className="text-xs text-zinc-500">Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-3 py-2 bg-zinc-900/50 rounded-full border border-zinc-800/50">
              <div className="w-7 h-7 bg-zinc-800 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium">{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-zinc-300">{user.name}</p>
                <p className="text-xs text-zinc-500 capitalize">{user.role}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="btn-ghost text-zinc-400 hover:text-zinc-100"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl font-semibold tracking-tight mb-3">
            Good {getGreeting()}, <span className="gradient-text">{user.name.split(' ')[0]}</span>
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
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                  <svg 
                    className="w-5 h-5 text-zinc-400 group-hover:text-zinc-100 transition-colors" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <svg 
                  className="w-5 h-5 text-zinc-600 group-hover:text-zinc-300 transition-colors" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold mb-2">{item.label}</h2>
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