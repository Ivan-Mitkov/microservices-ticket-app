import mongoose from "mongoose";
//an iteface that describes the properties that a required to create new Order
interface OrderAttrs {
  title: string;
  price: number;
  userId: string;
}
//an iteface that describes the properties that a Order model has

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}
//an inteface for Order Document
interface OrderDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}
const orderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
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

//call this function instead new Order({}) for type checking
orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};
const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export default Order;
