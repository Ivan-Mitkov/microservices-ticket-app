import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@microauth/common";

export { OrderStatus };
//an iteface that describes the properties that a required to create new Order
interface OrderAttrs {
  id: string;
  userId: string;
  status: OrderStatus;
  price: number;
  version: number;
}
//an iteface that describes the properties that a Order model has

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}
//an inteface for Order Document
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  price: number;
  version: number;
}
const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);
//CONCURRENCY
//Optimistic concurrency control with versions
//use field version instead __v
orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

//call this function instead new Order({}) for type checking
orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id:attrs.id,
    version:attrs.version,
    price:attrs.price,
    userId:attrs.userId,
    status:attrs.status
  });
};
//CONCURRENCY
orderSchema.statics.findByEvent = async (event: {
  id: string;
  version: number;
}) => {
  //find the order with two parameters id and VERSION NUMBER
  const order = await Order.findOne({
    _id: event.id,
    //order is updated in order service, and the version in data is +1
    //to find in Order DB we need to substract 1
    version: event.version - 1,
  });
  return order;
};
const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
