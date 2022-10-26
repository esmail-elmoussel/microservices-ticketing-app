import axios from "axios";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { axiosClient } from "../api/axios-client";

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
    <h1 onClick={() => router.push("/auth/register")}>Please login</h1>
  );
};

Home.getInitialProps = async (context) => {
  return await axiosClient(context)
    .get("/api/users/current-user")
    .then((res) => {
      return { user: res.data };
    })
    .catch((err) => {
      console.error(err.response.data);
      return {};
    });
};

export default Home;
