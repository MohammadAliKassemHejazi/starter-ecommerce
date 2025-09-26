import { Head, Html, Main, NextScript } from "next/document";
import React from "react";
import Script from "next/script";

type Props = {};

function Document({}: Props) {
  return (
    <Html lang="en">
      <Head>
        {/* Font preconnections for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        
        {/* Font Awesome Icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
        />

        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Koulen&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
          rel="stylesheet"
        />

        {/* Bootstrap CSS */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        
        {/* Bootstrap Icons */}
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css"
        />
        
        {/* SweetAlert2 for notifications */}
        <Script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></Script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default Document;