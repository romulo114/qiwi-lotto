import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta charSet="UTF-9" />
          {/* <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" /> */}
          <link
            rel="stylesheet"
            href="/styles/style.css"
            type="text/css"
            media="all"
          />
          <link
            rel="stylesheet"
            href="/styles/jquery.drawer.css"
            type="text/css"
            media="all"
          />
          <link
            rel="stylesheet"
            href="/styles/owl.carousel.css"
            type="text/css"
            media="all"
          />
          <link
            rel="stylesheet"
            href="/styles/my-account.css"
            type="text/css"
            media="all"
          />
          <link
            rel="stylesheet"
            href="/styles/home.css"
            type="text/css"
            media="all"
          />
          <link
            rel="stylesheet"
            href="/styles/cart.css"
            type="text/css"
            media="all"
          />
          <link
            rel="stylesheet"
            href="/styles/responsive-tabs.css"
            type="text/css"
            media="all"
          />
          <link
            rel="stylesheet"
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
            integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z"
            crossOrigin="anonymous"
          ></link>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
            integrity="sha512-+4zCK9k+qNFUR5X+cKL9EIR+ZOhtIloNl9GIKS57V1MyNsYpYcUrUeQc9vNfzsWfV28IaLL3i96P9sdNyeRssA=="
            crossOrigin="anonymous"
          ></link>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
        </Head>
        <body className="home">
          <Main />
          <NextScript />
          <script type="text/javascript" src="/js/custom.js"></script>
          <script type="text/javascript" src="/js/jquery.countdown.js"></script>
          <script
            type="text/javascript"
            src="/js/jquery.responsiveTabs.js"
          ></script>
          <script
            type="text/javascript"
            src="/js/jquery.simplyscroll.js"
          ></script>
          <script type="text/javascript" src="/js/owl.carousel.js"></script>
          <script type="text/javascript" src="/js/parseNumbers.js"></script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
