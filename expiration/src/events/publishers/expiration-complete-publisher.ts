import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from "@microauth/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
