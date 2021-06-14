import axios from "axios";

const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    // return axios.create({
    //   baseURL: "http://ingress-nginx.ingress-nginx.svc.cluster.local",
    //   headers: req.headers,
    // });
    try {
      const baseAxios = axios.create({
        baseURL: "http://www.microservices-ticketing.space",
        headers: req.headers,
      });
      return baseAxios;
    } catch (error) {
      console.log(error.message);
    }
  } else {
    try {
      const baseAxios = axios.create({
        baseURL: "/",
      });
      return baseAxios;
    } catch (error) {
      console.log(error.message);
    }
  }
};

export default buildClient;
