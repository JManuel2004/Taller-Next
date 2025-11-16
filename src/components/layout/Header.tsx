'use client';

import React from 'react';
import { useAuth } from '@/context';
import { Button } from '@/components/ui';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-gray-900 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-300 mt-1">{subtitle}</p>
            )}
            {user && (
              <p className="text-sm text-gray-300 mt-1">{user.fullname}</p>
            )}
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            disabled={isLoading}
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </header>
  );
};

