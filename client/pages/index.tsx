import type { NextPage } from "next";
import Link from "next/link";
import { User } from "../types/user.types";

interface Props {
  user?: User;
}

const Home: NextPage<Props> = ({ user }) => {
  return (
    <div className="container">
      {user ? <h1>Welcome, {user.email}</h1> : <h1>Please login</h1>}

      <Link href="/tickets">
        <a>Browse all tickets</a>
      </Link>
    </div>
  );
};

Home.getInitialProps = () => {
  console.log("INITIAL PROPS FROM HOME");

  return {};
};

export default Home;
