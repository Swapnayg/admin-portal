"use client"
import React, { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast'; // Optional

const Login = () => {
  const router = useRouter();
  const { toast } = useToast(); // Optional toast
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()) return;
  setLoading(true);

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        rememberMe,         // ← include flag
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      toast?.({ title: 'Login Failed', description: data.error, variant: 'destructive' });
      return;
    }

    toast?.({ title: 'Login Successful', description: `Welcome back, ${data.user.email}` });
    // CLEAR FIELDS HERE
    setEmail('');
    setPassword('');
    setRememberMe(false);
    router.push('/');
  } catch {
    toast?.({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' });
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border border-gray-200">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 text-2xl font-bold text-slate-700">[Logo]</div>
          <CardTitle className="text-2xl font-semibold text-slate-900">
            Login to Admin Portal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200"
                required
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200"
                required
              />
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-slate-600 border-slate-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-slate-600">
                  Remember Me
                </label>
              </div>
              <Link href="/reset-password" className="text-sm text-slate-600 hover:text-slate-800">
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-slate-700 hover:bg-slate-800 text-white"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          {/* <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Don't have access?{' '}
              <Link href="/contact" className="text-slate-600 hover:text-slate-800">
                Contact Admin
              </Link>
            </p>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
