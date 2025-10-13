'use client';
import { AuthProvider } from './AuthProvider';
import { CartProvider } from './CartProvider';

export default function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}
