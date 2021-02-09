/**
 * @author Rommel Loayza
 */
export class AppLogger {
  private readonly context: string;

  public static getInstance(context: string): AppLogger {
    return new AppLogger(context);
  }

  constructor(context: string) {
    this.context = context;
  }

  private message = msg => `[${new Date()}] [${this.context}] ${msg}`;

  error(msg: any, err?: any): void {
    console.error(this.message(msg), err);
  }

  log(msg: any): void {
    console.log(this.message(msg));
  }

  warn(msg: any): void {
    console.warn(this.message(msg));
  }

  debug(msg: any): void {
    console.log(this.message(msg));
  }
}
