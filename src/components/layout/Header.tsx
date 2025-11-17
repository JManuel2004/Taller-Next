'use client';

import React from 'react';
import { useAuth } from '@/context';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { user } = useAuth();

  return (
    <header className="bg-gray-900 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-300 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};


