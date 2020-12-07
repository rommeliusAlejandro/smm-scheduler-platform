/**
 * @author Rommel Loayza
 */
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ParticipantDocument, Participant } from '@smm/participants/schemas/participant.schema';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ParticipantsService {

  constructor(@InjectModel(Participant.name) private readonly participantModel: Model<ParticipantDocument>) {}

  create(participant: any): Observable<Participant> {
    participant['id'] = uuidv4();
    const newParticipant = new this.participantModel(participant);

    return from(newParticipant.save());
  }

  findAll(): Observable<Participant[]> {
    return from(this.participantModel.find().exec());
  }

  findOne(id: string): Observable<Participant> {
    return from(this.participantModel.findOne({id: id}));
  }

  update(id: string, attributes: any): Observable<Participant> {
    return from(
      this.participantModel.findOneAndUpdate({id: id}, attributes, { new: true })
    );
  }

  findBy(field: string, value: string): Observable<Participant[]> {
    let search  = {};
    search[field] = value;
    return from(
      this.participantModel.find(search).exec()
    )
  }

}
