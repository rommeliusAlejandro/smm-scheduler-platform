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
  skills?: Skills;
}

export class Log {
  date: Date;
  room: string;
}

export class Skills {
  [key: string]: number;
}
