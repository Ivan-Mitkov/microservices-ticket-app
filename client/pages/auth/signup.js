import React, { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: { email, password },
    onSuccess: () => Router.push("/"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await doRequest();
  };
  return (
    <div className="d-flex justify-content-center align-items-center flex-column ">
      <div className="w-50 " style={{ minWidth: "300px" }}>
        <form
          onSubmit={handleSubmit}
          className="d-flex justify-content-center align-items-center flex-column "
        >
          <h1 className="mt-5">Sign Up</h1>
          <div className="form-group w-50 p-3" style={{ minWidth: "200px" }}>
            <label>Email Address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group w-50 p-3" style={{ minWidth: "200px" }}>
            <label>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="form-control"
            />
          </div>
          {errors}

          <button className="btn btn-primary">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
