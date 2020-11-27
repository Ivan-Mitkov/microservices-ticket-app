import {Publisher,Subjects,TicketCreatedEvent} from '@microauth/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
  subject: Subjects.TicketCreated=Subjects.TicketCreated;
  
  
}