import * as events from 'events';

class Loading extends events.EventEmitter {
  constructor() {
    super();
  }

  listen() {
    if (!process.env.VERBOSE) {
      return void 0;
    }
    this.once('progress', this.progress.bind(this));
  }

  progress(message: string) {
    if (!process.env.VERBOSE) {
      return void 0;
    }
    process.stdout.write(message);
  }

  send(message: string) {
    if (!process.env.VERBOSE) {
      return void 0;
    }
    this.emit('progress', message);
  }
}

export default Loading;