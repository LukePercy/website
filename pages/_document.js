import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script'
export default class MyDocument extends Document {
  render() {
    return (
      <>
      <Html>
        <Head>
        </Head>
        <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
      </>
    );
  }
}