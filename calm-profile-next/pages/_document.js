import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* SEO Meta Tags */}
        <meta name="author" content="syrıs" />
        <meta name="keywords" content="workstyle assessment, team efficiency, meeting optimization, productivity tool" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://calmprofile.vercel.app/" />
        <meta property="og:site_name" content="calm.profile" />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://calmprofile.vercel.app/" />
        <meta property="twitter:title" content="calm.profile – syrıs." />
        <meta property="twitter:description" content="systematic calm for modern teams. 20 questions. $48k annual roi." />
        <meta property="twitter:image" content="/og-image.png" />
        
        {/* Fonts */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600&family=JetBrains+Mono:wght@200;300;400;500&display=swap" 
          rel="stylesheet" 
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}