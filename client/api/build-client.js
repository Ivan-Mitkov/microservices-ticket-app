import axios from "axios";

const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    const baseAxios = axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
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
