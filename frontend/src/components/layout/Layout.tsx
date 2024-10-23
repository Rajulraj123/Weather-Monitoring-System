import React from 'react';
import { ThemeProvider } from 'next-themes';

interface Props {
  children: React.ReactNode;
}

export const Layout: React.FC<Props> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto py-8 px-4">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
};