import { NextPage } from "next";
import { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.css";

const App: NextPage<AppProps> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default App;
