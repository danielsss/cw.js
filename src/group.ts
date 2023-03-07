import * as inquirer from 'inquirer';
import Base from './base';
import Loading from './loading';
import { CloudWatchLogs } from 'aws-sdk';
import { readFileSync, mkdirSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

inquirer.registerPrompt('search-list', require('inquirer-search-list'));
const debug = require('debug')('cw.js:group');


class Storage {
  protected defaultDirectory = join(homedir(), '/.cw.js/');

  protected defaultFilename = 'cache.json';

  protected cacheFile;

  constructor() {
    this.init();
  }

  init() {
    if (!existsSync(this.defaultDirectory)) {
      debug('create ~/.cw.js/ directory ...');
      mkdirSync(this.defaultDirectory, { recursive: true });
    }
    this.cacheFile = join(this.defaultDirectory, this.defaultFilename);
    if (!existsSync(this.cacheFile)) {
      debug('create file %s ...', this.cacheFile);
      writeFileSync(this.cacheFile, '{}');
    }
  }


  public save(data: Record<any, any>) {
    writeFileSync(this.cacheFile, JSON.stringify(data, null, 2));
    return this;
  }

  public load() {
    const c = readFileSync(this.cacheFile, { encoding: 'utf-8'});
    return JSON.parse(c);
  }

}

class CloudWatchLogGroup extends Base {

  protected storage: Storage;

  constructor(cloudWatch: CloudWatchLogs, loading: Loading) {
    super(cloudWatch, loading);
    this.storage = new Storage();
  }

  async choice(spinner, cache?: boolean): Promise<string> {
    const now = Date.now();
    let groups;
    if (cache) {
      groups = this.storage.load();
      if (!groups || Object.keys(groups).length <= 0) {
        groups = await this.describeLogGroups();
        this.storage.save(groups);
      }
      debug('hit local group cache ...');
    } else {
      groups = await this.describeLogGroups();
      this.storage.save(groups);
    }
    spinner.stop();
    const choices = [];
    debug('choices: %d', choices.length);
    for (let i = 0; i < groups.length; i++) {
      choices.push(groups[i].logGroupName);
    }
    debug('%d', Date.now() - now);
    return inquirer.prompt([{
      type: 'search-list',
      name: 'group',
      message: 'Search/Select a group name',
      choices
    }]).then(answer => answer.group);
  }


  async describeLogGroups() {
    let result = await this.cloudWatch.describeLogGroups().promise();
    let groups = [];
    do {
      groups = groups.concat(result.logGroups);
      result = await this.cloudWatch
        .describeLogGroups({ nextToken: result.nextToken })
        .promise();
    } while (result.nextToken);
    return groups;
  }
}

export default CloudWatchLogGroup;