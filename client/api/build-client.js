import axios from "axios";

const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    const baseAxios = axios.create({
      baseURL: "www.microservices-ticketing.space",
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
