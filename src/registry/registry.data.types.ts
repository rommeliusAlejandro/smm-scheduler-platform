/**
 * @author Rommel Loayza
 */
export class Participants {
  participants: Participant[];
}
export class Participant {
  id: string;
  name: string;
  gender: string;
  active : boolean;
  history: Log[];
  age: string;
  skills?: string[];
}

export class Log {
  date: Date;
  room: string;
}
