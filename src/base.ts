import { CloudWatchLogs, ECS } from 'aws-sdk';
import Loading from './loading';

class Base {
  constructor(
    protected ecs: ECS,
    protected cloudWatch: CloudWatchLogs,
    protected loading: Loading
  ) {
    if (!(cloudWatch instanceof CloudWatchLogs)) {
      throw new Error('should have an instance of CloudWatchLogs');
    }

    if (!(ecs instanceof ECS)) {
      throw new Error('should have an instance of ECS');
    }
    this.cloudWatch = cloudWatch;
    this.loading = loading;
    this.ecs = ecs;
  }
}

export default Base;