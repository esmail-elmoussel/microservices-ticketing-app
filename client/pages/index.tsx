import type { NextPage } from "next";
import { useRouter } from "next/router";
import { User } from "../types/user.types";

interface Props {
  user?: User;
}

const Home: NextPage<Props> = ({ user }) => {
  const router = useRouter();

  return (
    <div className="container">
      {user ? <h1>Welcome, {user.email}</h1> : <h1>Please login</h1>}
    </div>
  );
};

Home.getInitialProps = () => {
  console.log("INITIAL PROPS FROM HOME");

  return {};
};

export default Home;
