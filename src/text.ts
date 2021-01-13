import * as chalk from 'chalk';
import * as Debug from 'debug';
import * as utils from './utils';

import Base from './base';
import Loading from './loading';

import { CloudWatchLogs } from 'aws-sdk';

const debug = Debug('cw.js:text');

class CloudWatchLogText extends Base {
  protected groupName: string;
  protected streamName: string;
  protected next: string = null;
  protected previous: string = null;
  protected startTime: number = Date.now();

  constructor(cloudWatch: CloudWatchLogs, loading: Loading) {
    super(cloudWatch, loading);
  }

  group(name: string): CloudWatchLogText {
    this.groupName = name;
    return this;
  }

  stream(name: string): CloudWatchLogText {
    this.streamName = name;
    return this;
  }

  async output() {
    const logs = await this.getLatestLogs();
    debug('latest log: %j', logs);
    if (logs.events.length <= 0) {
      await utils.delay(1000);
    }
    for (const e of logs.events) {
      const t = new Date(e.timestamp);
      const head = chalk.green('[CloudWatch:Time:%s]');
      console.info(head + ' - %s', t.toLocaleString(), e.message);
      this.startTime = e.timestamp + 1;
    }
  }

  async getLatestLogs() {
    const defaultOptions = {
      logGroupName: this.groupName,
      logStreamName: this.streamName,
      startTime: this.startTime
    };
    return this.cloudWatch.getLogEvents(defaultOptions).promise();
  }

  async getLogs(): Promise<CloudWatchLogs.GetLogEventsResponse> {
    const defaultOptions = {
      logGroupName: this.groupName,
      logStreamName: this.streamName,
      startFromHead: true
    };
    if (this.next) {
      Object.assign(defaultOptions, {nextToken: this.next});
    }
    return this.cloudWatch.getLogEvents(defaultOptions).promise().then(logs => {
      this.next = logs.nextForwardToken || null;
      this.previous = logs.nextBackwardToken || null;
      return logs;
    });
  }
}

export default CloudWatchLogText;