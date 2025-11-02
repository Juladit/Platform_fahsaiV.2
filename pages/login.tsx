import React, { useState } from 'react';
import Head from 'next/head';
import Input from '../components/Input';
import Button from '../components/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function validate() {
    const e: { email?: string; password?: string } = {};
    if (!email) e.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = 'Please enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (!validate()) return;
    setLoading(true);
    // Simulate a login request. Replace with real auth call.
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    alert('Logged in (demo) — email: ' + email);
  }

  return (
  <div className=" flex items-start justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title className='black justify-center flex items-center font-bold'>Login</title>
      </Head>
      <div className="max-w-lg w-full space-y-8">
        <form className="mt-8 space-y-6 card" onSubmit={onSubmit} noValidate>
          <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-red-900">Activity Board</h2>
          <p className="mt-2 text-2xl text-black">Mea Fah Luang University</p>
        </div >
          <Input id="email" label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@company.com" error={submitted ? errors.email : undefined} />
          <Input id="password" label="Password" type="password" value={password} onChange={setPassword} placeholder="Enter your password" error={submitted ? errors.password : undefined} />

          <div className="flex items-center justify-between mb-2">

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot your password?</a>
            </div>
          </div>

          <div>
            <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 focus:ring-red-500">
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>

        <p className="text-center text-md text-gray-600">
          Don’t have an account? <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">Sign up</a>
        </p>
      </div>
    </div>
  );
}
