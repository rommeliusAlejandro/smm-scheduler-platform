/**
 * @author Rommel Loayza
 */
export class ParticipantReservedEvent {
  constructor(public  readonly  id: string,
              public  readonly week: string,
              public readonly roomId: string) {
  }
}
