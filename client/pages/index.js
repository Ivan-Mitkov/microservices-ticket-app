import Head from "next/head";
import styles from "../styles/Home.module.css";
import buildClient from "../api/build-client";

const Home = ({ currentUser }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Ticketing</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Ticketing</h1>
        <div>
          {currentUser
            ? `You are logged in with ${currentUser.email}`
            : `Not logged in`}
        </div>
      </main>

      <footer className={styles.footer}>Footer</footer>
    </div>
  );
};
//invoked from _app.js
Home.getInitialProps = async (context) => {
  const { data } = await buildClient(context).get("/api/users/currentuser");
  // console.log("Get initial props home page");
  return data;
};
export default Home;
