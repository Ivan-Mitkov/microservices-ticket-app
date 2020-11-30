import mongoose from "mongoose";
import Order, { OrderStatus } from "./Orders";
//an iteface that describes the properties that a required to create new Ticket
interface TicketAttrs {
  title: string;
  price: number;
}
//an iteface that describes the properties that a Ticket model has

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}
//an inteface for Ticket Document
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}
const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
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

//call this function instead new Ticket({}) for type checking
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};
//add method to Ticket Document
//need this so function
ticketSchema.methods.isReserved = async function () {
  //make sure this ticket is not already reserved
  //orders has associated ticket and order is not cancelled
  const alreadyOrdered = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.Complete,
        OrderStatus.AwaitingPayment,
      ],
    },
  });

  return !!alreadyOrdered;
};
const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export default Ticket;
