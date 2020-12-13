import React, { useEffect, useState } from "react";

const OrderShow = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [hoursLeft, setHoursLeft] = useState();
  const [minutesLeft, setMinutesLeft] = useState();
  const [secondsLeft, setSecondsLeft] = useState();
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

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }
  return (
    <div className="mt-5">
      {`${hoursLeft} hours, ${minutesLeft} minutes and ${secondsLeft} seconds left`}
    </div>
  );
};
OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};
export default OrderShow;
