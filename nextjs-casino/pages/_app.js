// pages/_app.js

import '../styles/global.css'; // global.cssのパスをプロジェクト構造に合わせて調整してください

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
