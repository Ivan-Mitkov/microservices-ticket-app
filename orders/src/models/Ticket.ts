import mongoose from "mongoose";
import { Order, OrderStatus } from "./Orders";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
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
    //
    toJSON: {
      transform(doc: any, ret: any) {
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

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  const { id, title, price } = attrs;
  return new Ticket({
    _id: id,
    title: title,
    price: price,
  });
};
//CONCURRENCY
ticketSchema.statics.findByEvent = async (event: {
  id: string;
  version: number;
}) => {
  //find the ticket with two parameters id and VERSION NUMBER
  const ticket = await Ticket.findOne({
    _id: event.id,
    //ticket is updated in ticket service, and the version in data is +1
    //to find in Order DB we need to substract 1
    version: event.version - 1,
  });
  return ticket;
};
ticketSchema.methods.isReserved = async function () {
  // this === the ticket document that we just called 'isReserved' on
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
