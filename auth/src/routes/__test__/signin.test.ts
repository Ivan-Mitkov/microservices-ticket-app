import request from "supertest";
import { app } from "../../app";

it("fails with email that does not exist ", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "123456" })
    .expect(400);
});
it("fails with incorect password ", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "123456" })
    .expect(201);
  await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "133456" })
    .expect(400);
});
it("signin with corect password and responds with a cookie", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "123456" })
    .expect(201);
  const response = await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "123456" })
    .expect(200);
  expect(response.get("Set-Cookie")).toBeDefined();
});
