import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
//an iteface that describes the properties that a required to create new Ticket
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}
//an iteface that describes the properties that a Ticket model has

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}
//an inteface for Ticket Document
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  //optional
  orderId?: string;
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
    },
    userId: {
      type: String,
      required: true,
    },
    //reservation of the ticket by an order, if the ticket is nor reserved is undefined
    orderId: {
      type: String,
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
ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

//call this function instead new Ticket({}) for type checking
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};
const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export default Ticket;
