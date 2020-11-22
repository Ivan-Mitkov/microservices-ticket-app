import Head from "next/head";
import styles from "../styles/Home.module.css";
import buildClient from "../api/build-client";

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
Home.getInitialProps = async (context) => {
  const { data } = await buildClient(context).get("/api/users/currentuser");
  console.log(data);
  return data;
};
export default Home;
