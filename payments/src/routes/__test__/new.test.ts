import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../models/Orders";
import { stripe } from "../../stripe";
jest.mock("../../__mocks__/stripe.ts");

it("should return 404 when purchasing an order that does not exists", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "iuiuoiuo",
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("should return 401 if order does not belong to the user", async () => {
  //create real order
  const id = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id,
    status: OrderStatus.Created,
    version: 0,
    userId: mongoose.Types.ObjectId().toHexString(),
    price: 23,
  });
  await order.save();
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "iuiuoiuo",
      orderId: id,
    })
    .expect(401);
});
it("should return 400 when purchasing a cancelled order", async () => {
  //create real order
  const id = mongoose.Types.ObjectId().toHexString();
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id,
    status: OrderStatus.Cancelled,
    version: 0,
    userId,
    price: 23,
  });
  await order.save();
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "iuiuoiuo",
      orderId: id,
    })
    .expect(400);
});

it("should return 204 with valid inputs", async () => {
  //create real order
  const id = mongoose.Types.ObjectId().toHexString();
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id,
    status: OrderStatus.Created,
    version: 0,
    userId,
    price: 23,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      //token for test mode
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  const chargedOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  // console.log(chargedOptions);
  expect(chargedOptions.source).toEqual("tok_visa");
  expect(chargedOptions.amount).toEqual(order.price * 100);
  expect(chargedOptions.currency).toEqual("bgn");
});
