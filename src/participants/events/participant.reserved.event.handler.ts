import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { ParticipantsService } from '@smm/participants/participants.service';
import { ParticipantReservedEvent } from '@smm/events/participant.reserved.event';

/**
 * @author Rommel Loayza
 */
@EventsHandler(ParticipantReservedEvent)
export class ParticipantReservedEventHandler implements IEventHandler<ParticipantReservedEvent> {

  @Inject()
  private readonly participantsService: ParticipantsService;

  handle(event: ParticipantReservedEvent) {
    this.participantsService.logHistory(event.id, event.week)
      .subscribe(
        next => {
          Logger.log(`${event.week} added as history for ${event.id}`);
        }
      )
  }

}
