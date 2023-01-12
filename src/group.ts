import * as inquirer from 'inquirer';
import Base from './base';
import Loading from './loading';
import { CloudWatchLogs, ECS } from 'aws-sdk';

inquirer.registerPrompt('search-list', require('inquirer-search-list'));
const debug = require('debug')('cw.js:group');

class CloudWatchLogGroup extends Base {
  constructor(
    ecs: ECS,
    cloudWatch: CloudWatchLogs,
    loading: Loading
  ) {
    super(ecs, cloudWatch, loading);
  }

  async choice(spinner): Promise<string> {
    let result = await this.cloudWatch.describeLogGroups().promise();
    let groups = [];
    do {
      groups = groups.concat(result.logGroups);
      result = await this.cloudWatch.describeLogGroups({ nextToken: result.nextToken }).promise();
    } while (result.nextToken);
    spinner.stop();
    const choices = [];
    debug('choices: %d', choices.length);
    for (let i = 0; i < groups.length; i++) {
      choices.push(groups[i].logGroupName);
    }
    return inquirer.prompt([{
      type: 'search-list',
      name: 'group',
      message: 'Search a group name',
      choices
    }]).then(answer => answer.group);
  }
}

export default CloudWatchLogGroup;