
import React, { useState } from 'react';
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ResetPassword = () => {
  const [email, setEmail] = useState('');

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Reset password for:', email);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border border-gray-200">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 text-2xl font-bold text-slate-700">[Logo]</div>
          <CardTitle className="text-2xl font-semibold text-slate-900">
            Reset Your Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Enter your email address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200"
                required
              />
            </div>
            
            <Button type="submit" className="w-full bg-slate-700 hover:bg-slate-800 text-white">
              Send Reset Link
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-slate-600 hover:text-slate-800">
              ← Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
