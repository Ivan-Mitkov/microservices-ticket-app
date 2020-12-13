import React, { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: { title, price },
    onSuccess: () => Router.push("/"),
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    doRequest();
  };
  const sanitizeInput = () => {
    const value = parseFloat(price);
    if (isNaN(value)) {
      setPrice("");
      return;
    }
    setPrice(value.toFixed(2));
  };
  return (
    <div className="d-flex justify-content-center align-items-center flex-column ">
      <h1>Create a Ticket</h1>
      <form
        className="d-flex justify-content-center align-items-center flex-column "
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            //sanitizing input
            onBlur={sanitizeInput}
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
