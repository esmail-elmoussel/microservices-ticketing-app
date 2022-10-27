import { AppContext, AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.css";
import { axiosClient } from "../api/axios-client";

interface User {
  email: string;
}

type Props = AppProps & {
  user?: User;
};

const App = ({ Component, pageProps, user }: Props) => {
  return (
    <>
      <div>Header</div>

      <Component {...pageProps} user={user} />
    </>
  );
};

App.getInitialProps = async (appContext: AppContext) => {
  let pageProps;
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  const response = await axiosClient(appContext.ctx)
    .get("/api/users/current-user")
    .catch((err) => {
      console.error(err.response.data);
      return null;
    });

  return {
    pageProps,
    user: response?.data,
  };
};

export default App;
