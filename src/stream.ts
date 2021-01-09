import Base from './base';
import Loading from './loading';
import { CloudWatchLogs } from 'aws-sdk';

class CloudWatchLogStream extends Base {
  constructor(cloudWatch: CloudWatchLogs, loading: Loading) {
    super(cloudWatch, loading);
  }

  async latestStream(logGroupName: string): Promise<CloudWatchLogs.LogStream> {
    const options = {
      logGroupName, limit: 1, orderBy: 'LastEventTime', descending: true
    };
    this.loading.send('Loading log stream ...');
    const streams = await this.cloudWatch.describeLogStreams(options).promise();
    return streams.logStreams[0];
  }
}

export default CloudWatchLogStream;