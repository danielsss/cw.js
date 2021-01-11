#!/usr/bin/env node

import * as chalk from 'chalk';
import helper from '../helper';
import Loading from '../loading';
import CloudWatchLogGroup from '../group';
import CloudWatchLogStream from '../stream';
import CloudWatchLogText from '../text';

import { helpful } from '../helper';
import { CloudWatchLogs } from 'aws-sdk';

async function main(): Promise<void> {
  const program = helper();

  const loading = new Loading();
  loading.listen();

  const cloudWatch = new CloudWatchLogs({region: program.region});

  const error = err => {
    if (err.code === 'InvalidSignatureException') {
      program.help(helpful('Error: ' + err.message));
    } else if (err.originalError && err.originalError.code === 'NetworkingError') {
      console.error(chalk.red('"cw.js" is a network tool. Make sure your network is available.'));
      program.help(helpful(''));
    } else {
      console.error(err);
      process.exit(1);
    }
  };
  // Initial classes
  const group = new CloudWatchLogGroup(cloudWatch, loading);
  let name = program.groupName;
  if (!name) {
    name = await group.choice().catch(error);
  }

  const stream = new CloudWatchLogStream(cloudWatch, loading);
  const latest = await stream.latestStream(name).catch(error);

  const text = new CloudWatchLogText(cloudWatch, loading);
  text.group(name);
  if (!latest || !latest.hasOwnProperty('logStreamName')) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new Error(`${name} does not contain streams`);
  }
  text.stream(latest.logStreamName);

  let stop = false;
  text.stop(() => stop = true);
  loading.send('Loading done ...');
  while (stop === false) {
    if (stop) { break; }
    await text.output();
  }
}

const error = err => {
  console.error('Main:Error', err);
  process.exit(1);
};

main().catch(error);