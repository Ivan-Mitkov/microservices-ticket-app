import axios from "axios";

const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    // return axios.create({
    //   baseURL: "http://ingress-nginx.ingress-nginx.svc.cluster.local",
    //   headers: req.headers,
    // });
    const baseAxios = axios.create({
      baseURL: "http://www.microservices-ticketing.space",
      headers: req.headers,
    });
    return baseAxios;
  } else {
    const baseAxios = axios.create({
      baseURL: "/",
    });
    return baseAxios;
  }
};

export default buildClient;
