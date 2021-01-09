import { CloudWatchLogs } from 'aws-sdk';
import Loading from './loading';

class Base {
  constructor(protected cloudWatch: CloudWatchLogs, protected loading: Loading) {
    if (!(cloudWatch instanceof CloudWatchLogs)) {
      throw new Error('should have an instance of CloudWatchLogs');
    }
    this.cloudWatch = cloudWatch;
    this.loading = loading;
  }
}

export default Base;