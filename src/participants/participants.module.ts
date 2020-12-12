/**
 * @author Rommel Loayza
 */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Participant, ParticipantSchema } from '@smm/participants/schemas/participant.schema';
import { ParticipantsService } from '@smm/participants/participants.service';
import { ParticipantsController } from '@smm/participants/participants.controller';
import { ParticipantReservedEventHandler } from '@smm/participants/events/participant.reserved.event.handler';

@Module({
  providers: [
    ParticipantsService,
    ParticipantReservedEventHandler
  ],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: Participant.name, schema: ParticipantSchema
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
