/**
 * @author Rommel Loayza
 */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Participant, Participants } from '@smm/registry/registry.data.types';
import { ParticipantsService } from '@smm/participants/participants.service';

@Injectable()
export class RegistryDataStore {

  private store: Participants;

  @Inject()
  private readonly participantsService: ParticipantsService;

  createStore(data: string) {
    Logger.log(`Storing data in collection from JSON file`);
    this.store = new Participants();
    this.store.participants = [];

    const keys = Object.keys(data);

    for (let key of keys) {

      this.participantsService.create(data[key]).subscribe(
        next => {
          const participant: Participant = Object.assign(data[key]);
          participant.id = next.id;
          this.store.participants.push(participant);
        },
      );
    }
  }

  getStore() {
    return [...this.store.participants];
  }

  initializeStore() {
    Logger.log(`Loading data from collection...`);
    this.store = new Participants();
    this.store.participants = [];

    this.participantsService.findAll().subscribe(
      next => {
        Logger.log(`Loading ${next.length} participants...`);
        for (let item of next) {
          const participant: Participant = Object.assign(item);
          this.store.participants.push(participant);
        }
      },
    );
  }
}
