/**
 * @author Rommel Loayza
 */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Participant, ParticipantSchema } from '@smm/participants/schemas/participant.schema';
import { ParticipantsService } from '@smm/participants/participants.service';
import { ParticipantsController } from '@smm/participants/participants.controller';
import { ParticipantReservedEventHandler } from '@smm/participants/events/participant.reserved.event.handler';
import { ParticipantsHistoryService } from '@smm/participants/participants.history.service';
import { ParticipantHistory, ParticipantHistorySchema } from '@smm/participants/schemas/participant-history.schema';

@Module({
  providers: [
    ParticipantsService,
    ParticipantReservedEventHandler,
    ParticipantsHistoryService
  ],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: Participant.name, schema: ParticipantSchema
        },
        {
          name: ParticipantHistory.name, schema: ParticipantHistorySchema
        }
      ]
    )
  ],
  exports: [
    ParticipantsService
  ],
  controllers: [
    ParticipantsController
  ]
})
export class ParticipantsModule {

}
