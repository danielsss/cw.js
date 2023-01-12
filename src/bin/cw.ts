#!/usr/bin/env node

import * as chalk from 'chalk';
import helper from '../helper';
import Loading from '../loading';
import CloudWatchLogGroup from '../group';
import CloudWatchLogStream from '../stream';
import CloudWatchLogText from '../text';
import { helpful } from '../helper';
import { CloudWatchLogs, ECS } from 'aws-sdk';

const debug = require('debug')('cw.js:bin:cmd');

async function main(): Promise<void> {
  const program = helper();
  debug(program);
  const loading = new Loading();
  loading.listen();

  const cloudWatch = new CloudWatchLogs({region: program.region});
  const ecs = new ECS({region: program.region});

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
  const group = new CloudWatchLogGroup(ecs, cloudWatch, loading);
  let name = program.groupName;
  if (!name) {
    name = await group.choice().catch(error);
  }

  const stream = new CloudWatchLogStream(ecs, cloudWatch, loading);
  await stream.setup(name, !isNaN(program.clusters) ? Number(program.clusters) : 4).catch(error);

  const text = new CloudWatchLogText(ecs, cloudWatch, loading);
  text.group(name);
  text.streams(stream.tasks);
  loading.send('Loading done ...');

  let err = null;
  do {
    await text.output().catch(e => err = e);
  } while (err === null);
  console.error(err);
}

const error = err => {
  console.error('Main:Error', err);
  process.exit(1);
};

main().catch(error);