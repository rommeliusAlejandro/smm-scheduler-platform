/**
 * @author Rommel Loayza
 */
export class Participants {
  participants: Participant[];
}
export class Participant {
  name: string;
  gender: string;
  active : boolean;
  history: Log[];
  age: string;
}

export class Log {
  date: Date;
  room: string;
}
