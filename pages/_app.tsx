import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { useRouter } from 'next/router';
import Header from '../components/Header';

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const showHeader = router.pathname === '/login';

  return (
    <>
      {showHeader && <Header />}
      <Component {...pageProps} />
    </>
  );
}
