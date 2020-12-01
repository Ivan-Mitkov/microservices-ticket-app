import { Publisher, Subjects, OrderCancelledEvent } from "@microauth/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
