import { Publisher, Subjects, PaymentCreatedEvent } from "@microauth/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
