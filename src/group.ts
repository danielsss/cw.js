import * as inquirer from 'inquirer';
import Base from './base';
import Loading from './loading';
import { CloudWatchLogs } from 'aws-sdk';


class CloudWatchLogGroup extends Base {
  constructor(cloudWatch: CloudWatchLogs, loading: Loading) {
    super(cloudWatch, loading);
  }

  async choice(): Promise<string> {
    const result = await this.cloudWatch.describeLogGroups().promise();
    const groups = result.logGroups;
    const choices = [];
    for (let i = 0; i < groups.length; i++) {
      choices.push(groups[i].logGroupName);
    }
    return inquirer.prompt([{
      type: 'list',
      name: 'group',
      message: 'You can choice a group name for log stream.',
      choices
    }])
      .then(answer => answer.group);
  }
}

export default CloudWatchLogGroup;