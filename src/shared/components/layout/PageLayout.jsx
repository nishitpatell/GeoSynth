/**
 * Page Layout Component
 * Standard layout wrapper for pages
 */

import { Navbar } from './Navbar';

export const PageLayout = ({ children, className = '' }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={className}>
        {children}
      </main>
    </div>
  );
};
