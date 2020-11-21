import request from "supertest";
import { app } from "../../app";

it("returns 201 on successful signup ", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "bs@b.com",
      password: "123456",
    })
    .expect(201);
});

it("should return 400 with invalid email ", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "bs@b.c",
      password: "123456",
    })
    .expect(400);
});
it("should return 400 with invalid password ", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "bs@b.c",
      password: "123",
    })
    .expect(400);
});
it("should return 400 with missing email and password ", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "c@c.com", password: "" })
    .expect(400);
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "",
      password: "123456",
    })
    .expect(400);
});

it("disallows duplicate emails ", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "c@c.com",
      password: "123456",
    })
    .expect(201);
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "c@c.com",
      password: "123456",
    })
    .expect(400);
});

it("sets a cookie after successful signup ", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "bs@b.com",
      password: "123456",
    })
    .expect(201);
  expect(response.get("Set-Cookie")).toBeDefined();
});
