import type { NextPage } from "next";
import { useRouter } from "next/router";

interface User {
  email: string;
}

interface Props {
  user?: User;
}

const Home: NextPage<Props> = ({ user }) => {
  const router = useRouter();

  return user ? (
    <h1>Welcome, {user.email}</h1>
  ) : (
    <h1 onClick={() => router.push("/auth/login")}>Please login</h1>
  );
};

Home.getInitialProps = () => {
  console.log("INITIAL PROPS FROM HOME");

  return {};
};

export default Home;
