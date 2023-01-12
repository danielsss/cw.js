import Base from './base';
import Loading from './loading';
import { CloudWatchLogs, ECS} from 'aws-sdk';

const debug = require('debug')('cw.js:stream');

class CloudWatchLogStream extends Base {

  public tasks: {id: string; name: string}[] = [];

  constructor(
    ecs: ECS,
    cloudWatch: CloudWatchLogs,
    loading: Loading
  ) {
    super(ecs, cloudWatch, loading);
  }

  async setup(logGroupName: string, cluster?: number) {
    const options = {
      logGroupName, limit: cluster || 4,
      orderBy: 'LastEventTime', descending: true
    };
    this.loading.send('Loading log stream ...');
    const streams = await this.cloudWatch.describeLogStreams(options).promise();
    for (const s of streams.logStreams) {
      const name = s.logStreamName;
      const arr = name.split('/');
      this.tasks.push({ id: arr[arr.length - 1], name });
    }

    debug(this.tasks);
  }
}

export default CloudWatchLogStream;