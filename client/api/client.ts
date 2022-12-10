import axios, { AxiosRequestHeaders } from "axios";
import { NextPageContext } from "next";

export const buildClient = (context?: NextPageContext) => {
  if (typeof window === "undefined") {
    // Server (pod) request
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: context?.req?.headers as AxiosRequestHeaders,
    });
  }

  // Browser request
  return axios.create({ baseURL: "/" });
};
