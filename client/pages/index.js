import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
const Home = ({ currentUser, tickets }) => {
  const ticketList =
    tickets &&
    tickets.map((ticket) => {
      return (
        <tr key={ticket.id}>
          <td>{ticket.title}</td>
          <td className="w-25">${ticket.price}</td>
          <td className="w-25">
            {/* LINKING TO WILD CARD ROUTES */}
            <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
              <a className="nav-link">Details</a>
            </Link>
          </td>
        </tr>
      );
    });
  return (
    <div className={styles.container}>
      <Head>
        <title>Ticketing</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Ticketing</h1>
        <table className="table table-striped table-success mt-5 ">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>{ticketList}</tbody>
        </table>
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
