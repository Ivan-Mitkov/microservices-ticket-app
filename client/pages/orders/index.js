import React from "react";
import styles from "../../styles/Home.module.css";
import Link from "next/link";
const Order = ({ orders }) => {
  console.log(orders);
  return (
    <div className={styles.container}>
      <ul className="list-group">
        {orders &&
          orders.map((order) => {
            if (order.status === "complete") {
              return (
                <li key={order.id} className="list-group-item">
                  <div>Ticket: {order.ticket.title}</div>
                  <div>Status: {order.status}</div>
                </li>
              );
            } else {
              return (
                <Link href={`/orders/${order.id}`}>
                  <a key={order.id}>
                    <li className="list-group-item">
                      <div>Ticket: {order.ticket.title}</div>
                      <div>Status: {order.status}</div>
                    </li>
                  </a>
                </Link>
              );
            }
          })}
      </ul>
    </div>
  );
};

Order.getInitialProps = async (context, client) => {
  const { data } = await client.get(`/api/orders`);
  return { orders: data };
};
export default Order;
