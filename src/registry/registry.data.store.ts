/**
 * @author Rommel Loayza
 */
import { Injectable, Logger } from '@nestjs/common';
import { Participants } from '@smm/registry/registry.data.types';

@Injectable()
export class RegistryDataStore {

  private store: Participants;

  initializeStore(data: string) {
    this.store = new Participants();
    this.store.participants = [];

    const keys = Object.keys(data);

    for(let key of keys) {
      this.store.participants.push(Object.assign(data[key]));
    }
  }

  getStore() {
    return [...this.store.participants];
  }
}
