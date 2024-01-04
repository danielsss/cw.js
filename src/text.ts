import * as chalk from 'chalk';
import * as utils from './utils';
import Base from './base';
import Loading from './loading';
import { CloudWatchLogs } from 'aws-sdk';


class CloudWatchLogText extends Base {
  protected groupName: string;
  protected streamNames: {id: string; name: string}[];
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

  /**
   * To support multi log stream
   * @param tasks
   */
  streams(tasks: {id: string; name: string}[]): CloudWatchLogText {
    this.streamNames = tasks;
    return this;
  }

  async output(spinner) {
    const events = {};
    for (const stream of this.streamNames) {
      events[stream.id] = await this.latestLogEvents(stream.name);
    }

    if (Object.keys(events).length <= 0) {
      await utils.delay(1000);
    }

    if (spinner) {
      spinner.stop();
    }

    for (const key in events) {
      const head = '[ ' + chalk.green('cw.js - ') + chalk.red(key) + ' ]';
      if (!events[key].events || events[key].events.length <= 0) {
        continue;
      }
      for (const e of events[key].events) {
        console.info(head + ' - %s', e.message);
        this.startTime = e.timestamp + 1;
      }
    }
  }

  async latestLogEvents(name: string) {
    const defaultOptions = {
      logGroupName: this.groupName,
      logStreamName: name,
      startTime: this.startTime
    };
    return this.cloudWatch.getLogEvents(defaultOptions).promise();
  }
}

export default CloudWatchLogText;
