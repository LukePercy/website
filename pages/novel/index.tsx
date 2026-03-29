import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import { isValidNovelCookie, NOVEL_COOKIE_NAME } from '../../lib/novelAuth';

interface Props {
  error: boolean;
}

export default function NovelLogin({ error }: Props) {
  return (
    <>
      <Head>
        <title>Reader access — L.J. Percy</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-[#0f1624] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <p className="text-xs tracking-[0.2em] uppercase text-[#c49a2a] mb-2">
              The Bright Files · Book Two
            </p>
            <h1 className="text-2xl font-normal text-white tracking-wide">
              Hunter of the Strait
            </h1>
            <p className="mt-3 text-sm text-gray-400">
              Enter the reader password to continue.
            </p>
          </div>

          <form method="POST" action="/api/novel-auth" className="space-y-4">
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                autoFocus
                className="w-full bg-[#1a2035] border border-[#2a3050] text-white placeholder-gray-500 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c49a2a] focus:border-transparent"
                placeholder="Password"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400" role="alert">
                Incorrect password. Try again.
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-[#8b6914] hover:bg-[#c49a2a] text-white py-3 px-4 rounded text-sm tracking-wide transition-colors duration-150"
            >
              Read
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-600">
            Got the link from Luke?{' '}
            <a
              href="mailto:luke@ljpercy.com"
              className="text-[#c49a2a] hover:underline"
            >
              Get in touch
            </a>{' '}
            for access.
          </p>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const cookie = req.cookies[NOVEL_COOKIE_NAME];
  if (isValidNovelCookie(cookie)) {
    return { redirect: { destination: '/novel/read', permanent: false } };
  }
  return { props: { error: query.error === '1' } };
};
