'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context';

export const Navbar: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const isActive = (path: string) => {
    return pathname.startsWith(path) ? 'text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-900';
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo + Links */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div
            onClick={() => router.push('/dashboard/admin')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-lg font-bold text-gray-900">Project</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <a
              href="/projects"
              className={`text-sm transition-colors ${isActive('/projects')}`}
            >
              Proyectos
            </a>
            <a
              href="/tasks"
              className={`text-sm transition-colors ${isActive('/tasks')}`}
            >
              Tareas
            </a>
            {user?.role === 'superadmin' && (
              <a
                href="/users"
                className={`text-sm transition-colors ${isActive('/users')}`}
              >
                Usuarios
              </a>
            )}
          </div>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-gray-700">
                {user?.fullname?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-gray-900 line-clamp-1">
                {user?.fullname || 'Usuario'}
              </p>
              <p className="text-xs text-gray-500">
                {user?.role === 'superadmin' ? 'Administrador' : 'Usuario'}
              </p>
            </div>
            <svg
              className={`w-4 h-4 text-gray-600 transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">{user?.fullname}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
