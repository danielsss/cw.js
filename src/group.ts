import * as _ from 'lodash';

import Base from './base';
import Loading from './loading';

import { CloudWatchLogs } from 'aws-sdk';


class CloudWatchLogGroup extends Base {
  constructor(cloudWatch: CloudWatchLogs, loading: Loading) {
    super(cloudWatch, loading);
  }

  async getGroupBy(name: string): Promise<CloudWatchLogs.LogGroup>{
    if (!name || typeof name !== 'string') {
      throw new TypeError(`Expect string as name, but got type "${typeof name}"`);
    }
    this.loading.send('Loading log groups ...');
    const groups = await this.cloudWatch.describeLogGroups().promise();
    return _.find(groups.logGroups, group => group.logGroupName === name);
  }
}

export default CloudWatchLogGroup;