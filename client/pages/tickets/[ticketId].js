import React, { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import useRequest from "../../hooks/use-request";
import Router from "next/router";
const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: `/api/orders`,
    method: "post",
    body: { ticketId: ticket.id },
    onSuccess: (order) => {
      console.log(order);
      return Router.push("/orders/[orderId]", `/orders/${order.order.id}`);
    },
  });
  const handleClick = () => {
    doRequest();
  };
  const [errorToShow, setErrorToShow] = useState("");
  useEffect(() => {
    if (errors) {
      setErrorToShow(errors);
      setTimeout(() => setErrorToShow(""), 3000);
    } else {
      setErrorToShow("");
    }
    console.log("Use Effect");
  }, [errors]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{ticket.title}</h1>
      <h4 className={styles.description}>Price: ${ticket.price}</h4>
      {errorToShow}
      <button
        className="btn btn-primary"
        onClick={handleClick}
        disabled={!!errors}
      >
        Purchase
      </button>
    </div>
  );
};
TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return {
    ticket: data,
  };
};
export default TicketShow;
