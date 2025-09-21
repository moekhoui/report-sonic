import React from 'react';
import ColorContrastTest from '../src/components/ColorContrastTest';
import Logo from '../src/components/Logo';
import ThemeToggle from '../src/components/ThemeToggle';

export default function ColorTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800 transition-all duration-500">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="container">
          <div className="flex items-center justify-between py-4">
            <Logo size="md" variant="full" />
            <div className="flex items-center gap-6">
              <ThemeToggle />
              <a href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-8">
        <ColorContrastTest />
      </div>
    </div>
  );
}
