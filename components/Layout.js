import Head from 'next/head';

import Header from './header';
import { useFetchUser, UserProvider } from '../lib/user';

const Layout = ({ children }) => {
  const { user, loading } = useFetchUser();
  return (
    <UserProvider value={{ user, loading }}>
      <Head>
        <title>Next.js with Auth0</title>
      </Head>

      <Header />

      <main>
        <div className="container">{children}</div>
      </main>

      <style jsx>{`
        .container {
          max-width: 42rem;
          margin: 1.5rem auto;
        }
      `}</style>
      <style jsx global>{`
        body {
          margin: 0;
          color: #222;
          font-family: Menlo;
        }
      `}</style>
    </UserProvider>
  );
};

export default Layout;