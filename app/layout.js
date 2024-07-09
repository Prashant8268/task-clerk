// app/layout.js
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
export default async function RootLayout({ children }) {

  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
