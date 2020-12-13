import Head from "next/head";
import styles from "../styles/Home.module.css";

const Home = ({ currentUser,tickets }) => {
  console.log(tickets);
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
Home.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/tickets");
  return { tickets: data };
};
export default Home;
