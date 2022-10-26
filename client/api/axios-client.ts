import axios, { AxiosRequestHeaders } from "axios";
import { NextPageContext } from "next";

export const axiosClient = (context: NextPageContext) => {
  if (typeof window === "undefined") {
    // Client server (pod) request
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: context.req?.headers as AxiosRequestHeaders,
    });
  }

  // Browser request
  return axios.create({ baseURL: "/" });
};
