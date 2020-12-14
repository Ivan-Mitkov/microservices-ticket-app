import React, { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import Router from 'next/router'
import useRequest from "../../hooks/use-request";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [hoursLeft, setHoursLeft] = useState();
  const [minutesLeft, setMinutesLeft] = useState();
  const [secondsLeft, setSecondsLeft] = useState();

  //api call
  const { doRequest, errors } = useRequest({
    url: `/api/payments`,
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) =>Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = Math.round(new Date(order.expiresAt) - new Date());
      setTimeLeft(Math.round(msLeft / 1000));
      setHoursLeft(new Date(msLeft).getHours().toLocaleString());
      setMinutesLeft(new Date(msLeft).getMinutes().toLocaleString());
      setSecondsLeft(new Date(msLeft).getSeconds().toLocaleString());
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);
    return () => clearInterval(timerId);
  }, []);
  // console.log(process.env.REACT_APP_STRIPE_PUB_KEY);
  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }
  return (
    <div className="mt-5">
      {`${hoursLeft} hours, ${minutesLeft} minutes and ${secondsLeft} seconds left`}
      <div>
        {/* https://stripe.com/docs/testing */}
        {/* send to payment service */}
        <StripeCheckout
          token={({ id }) => doRequest({ token: id })}
          stripeKey={process.env.REACT_APP_STRIPE_PUB_KEY}
          amount={order.ticket.price * 100}
          email={currentUser.email}
          currency="BGN"
          locale="auto"
        />
      </div>
      {errors}
    </div>
  );
};
OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};
export default OrderShow;
