'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function ResetPasswordPage() {
  const search = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const token = search.get('token') ?? '';
  const [email, setEmail] = useState('');
  const [newPass, setNewPass] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>(token ? 'reset' : 'request');
  const [loading, setLoading] = useState(false);

  // If token present but invalid, fallback to request
  useEffect(() => {
    if (token) setStep('reset');
  }, [token]);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    toast?.({ title: data.message });
    setEmail('');
    setLoading(false);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword: newPass }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (res.ok) {
      toast?.({ title: data.message });
      router.push('/login');
    } else {
      toast?.({ title: data.error, variant: 'destructive' });
    }
    setNewPass('');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border border-gray-200">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 text-2xl font-bold text-slate-700">[Logo]</div>
          <CardTitle className="text-2xl font-semibold text-slate-900">
            {step === 'request' ? 'Reset Your Password' : 'Choose New Password'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 'request' ? (
            <form onSubmit={handleRequest} className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">Email Address</label>
              <Input
                type="email"
                value={email}
                className="w-full border border-gray-200"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" disabled={loading} className="w-full bg-slate-700 hover:bg-slate-800 text-white">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <p className="text-center text-sm">
                Know your password?{' '}
                <Link href="/login" className="text-slate-600 underline">
                  Back to Login
                </Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                New Password
              </label>
              <Input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full border border-gray-200"
                required
                minLength={6}
              />
              <Button type="submit" disabled={loading} className="w-full bg-slate-700 hover:bg-slate-800 text-white">
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
