// app/login/page.tsx
'use client';
import { Suspense } from 'react';

import ResetPassword from '@/components/ResetPassword';

export default function PasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
}
