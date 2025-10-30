import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 — Page not found</h1>
        <p className="mb-6">The page you requested could not be found.</p>
        <Link href="/login" className="text-indigo-600 hover:underline">
          Go to sign in
        </Link>
      </div>
    </div>
  );
}
