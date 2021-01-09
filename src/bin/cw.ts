#!/usr/bin/env node

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
    }
  };
  // Initial classes
  const group = new CloudWatchLogGroup(cloudWatch, loading);
  await group.getGroupBy(program.groupName).catch(error);

  const stream = new CloudWatchLogStream(cloudWatch, loading);
  const latest = await stream.latestStream(program.groupName);

  const text = new CloudWatchLogText(cloudWatch, loading);
  text.group(program.groupName);
  text.stream(latest.logStreamName);

  let stop = false;
  text.stop(() => stop = true);
  loading.send('Loading done ...');
  while (stop === false) {
    if (stop) {
      break;
    }

    await text.output();
  }
}

const error = err => {
  console.error(err);
  process.exit(1);
};

main().catch(error);