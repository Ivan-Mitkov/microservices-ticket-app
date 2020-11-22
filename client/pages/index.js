import Head from "next/head";
import axios from "axios";
import styles from "../styles/Home.module.css";

const Home = ({ currentUser }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Ticketing</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Ticketing</h1>
      </main>

      <footer className={styles.footer}>Footer</footer>
    </div>
  );
};
Home.getInitialProps = async ({ req }) => {
  // console.log(req.headers);
  if (typeof window === "undefined") {
    //we are on the server
    console.log("Get initial props server");
    const response = await axios.get(
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
      {
        //ingress doesn't know the host when we are using namespace and services
        // headers: {
        //   Host: "ticketing.dev",
        // },
        headers: req.headers,
      }
    );
    console.log(response.data);
    return response.data;
  } else {
    //we are on the browser
    console.log("Get initial props browser");

    const response = await axios.get("/api/users/currentuser");
    console.log(response.data);
    return response.data;
  }
};
export default Home;
