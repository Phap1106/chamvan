// src/components/providers/RootProviders.tsx
'use client';

import { AuthProvider } from './AuthProvider';
import CartProvider from './CartProvider';
import Toaster from '@/components/Toaster';

export default function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {/* Toaster là client-only, an toàn với SSR nhờ mounted check */}
        <Toaster />
        {children}
      </CartProvider>
    </AuthProvider>
  );
}
