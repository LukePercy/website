import Document, { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default class MyDocument extends Document {
  render() {
    const measurementId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS?.trim();

    return (
      <Html lang="en-NZ">
        <Head>
          {measurementId ? (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
                strategy="afterInteractive"
              />
              <Script id="google-analytics" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${measurementId}', {
                    page_path: window.location.pathname,
                  });
                `}
              </Script>
            </>
          ) : null}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}