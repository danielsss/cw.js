import * as chalk from 'chalk';

import Base from './base';
import Loading from './loading';

import { CloudWatchLogs } from 'aws-sdk';
import { EventEmitter } from 'events';


class CloudWatchLogText extends Base {
  protected groupName: string;
  protected streamName: string;
  protected next: string = null;
  protected previous: string = null;
  protected startTime: number = Date.now();

  private event: EventEmitter;

  constructor(cloudWatch: CloudWatchLogs, loading: Loading) {
    super(cloudWatch, loading);
    this.event = new EventEmitter();
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
    for (const e of logs.events) {
      const t = new Date(e.timestamp);
      const head = chalk.green('[CloudWatch:Date:%s]');
      console.info(head + ' - %s', t.toLocaleString(), e.message);
      this.startTime = e.timestamp;
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

  stop(fn) {
    this.event.once('stop', fn);
  }
}

export default CloudWatchLogText;