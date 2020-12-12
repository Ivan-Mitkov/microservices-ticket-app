import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@microauth/common";
import { stripe } from "../stripe";

//an iteface that describes the properties that a required to create new Payment
interface PaymentAttrs {
  orderId: string;
  stripeId: string;
}
//an iteface that describes the properties that a Payment model has

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}
//an inteface for Payment Document
interface PaymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
}
const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
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

//call this function instead new payment({}) for type checking
paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  "Payment",
  paymentSchema
);

export { Payment };
