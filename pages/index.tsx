import { GetServerSideProps } from 'next';

export default function Home() {
  // This page should never render because we redirect on the server.
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  };
};
