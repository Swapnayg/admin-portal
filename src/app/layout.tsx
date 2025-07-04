// app/layout.tsx
import './globals.css';
import { StyledEngineProvider } from '@mui/material/styles';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Dashboard',
  description: 'Multi-vendor Admin Portal Dashboard',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StyledEngineProvider injectFirst>{children}</StyledEngineProvider>
      </body>
    </html>
  );
}
