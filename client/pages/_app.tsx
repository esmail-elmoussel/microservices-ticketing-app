import { AppContext, AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.css";
import { axiosClient } from "../api/axios-client";
import { User } from "../types/user.types";
import Header from "../components/shared/header.component";

type Props = AppProps & {
  user?: User;
};

const App = ({ Component, pageProps, user }: Props) => {
  return (
    <div>
      <Header user={user} />

      <Component {...pageProps} user={user} />
    </div>
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
