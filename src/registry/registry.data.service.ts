/**
 * @author Rommel Loayza
 */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { RegistryDataStore } from '@smm/registry/registry.data.store';
import { Observable, of } from 'rxjs';
import { Log, Participant } from '@smm/registry/registry.data.types';
import { ParticipantsService } from '@smm/participants/participants.service';
import { map } from 'rxjs/operators';

@Injectable()
export class RegistryDataService {

  @Inject()
  private readonly registryDataStore: RegistryDataStore;

  @Inject()
  private readonly participantsService: ParticipantsService;

  findByGender(gender: string): Observable<Participant[]> {
    const store = this.registryDataStore.getStore();
    const filtered = store.filter(participant => participant.gender === gender);

    return of(filtered);
  }

  findByAge(age: string): Observable<Participant[]> {
    const store = this.registryDataStore.getStore();
    const filtered = store.filter(participant => participant.age === age);

    return of(filtered);
  }

  findByName(name: string): Observable<Participant[]> {
    const store = this.registryDataStore.getStore();
    const filtered = store.filter(participant => participant.name === name);

    return of(filtered);
  }

  findActive(): Observable<Participant[]> {
    const store = this.registryDataStore.getStore();
    const filtered = store.filter(participant => participant.active === true);

    return of(filtered);
  }

  findInactive(): Observable<Participant[]> {
    const store = this.registryDataStore.getStore();
    const filtered = store.filter(participant => participant.active === false);

    return of(filtered);
  }

  findMonthCandidates(month: number): Observable<Participant[]> {
    return this.participantsService.findActive()
      .pipe(map(participants => {
        return participants.filter(participant => {

          if (!participant.active) {
            return false;
          }

          if (!participant.history || 0 === participant.history.length) {
            return true;
          }

          let sorted = participant.history.sort((a: Log, b: Log) => {
            if (a.date > b.date) {
              return 1;
            }

            if (a.date < b.date) {
              return -1;
            }

            return 0;
          });
          let last: Date = new Date(sorted[sorted.length - 1].date);
          let lastMonth = last.getMonth() + 1;

          if (month == lastMonth) {
            return false;
          }

          if (month == lastMonth + 1) {
            return false;
          }

          return true;
        });
      }));
  }

}
