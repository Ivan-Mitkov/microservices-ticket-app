import { Publisher, Subjects, OrderCreatedEvent } from "@microauth/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

//usage new OrderCreatedPublisher(natsclient).publish({//information about event})
