import React from 'react';
import { Providers } from './providers';
import './globals.css';

export const metadata = {
  title: 'DataMatic | Streamlined Data Editing for Specialized Industries',
  description: 'Transform Your Data Management in Healthcare and Beyond',
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <Providers>
          <main>
            <header>
              <h1>DataMatic</h1>
              <p>Transform Your Data Management in Healthcare and Beyond</p>
            </header>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
};

export default Layout;