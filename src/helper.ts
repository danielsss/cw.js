import * as commander from 'commander';
import * as chalk from 'chalk';
import * as AWS from 'aws-sdk';

const version = require('../package.json').version;

export const helpful = function(errorMessage: string) {
  return function (message: string) {
    return message + chalk.red(errorMessage);
  };
};

export default function (): commander.Command {
  const program = new commander.Command();
  program
    .version(version)
    .name('cw')
    .usage('[Options]')

    .option('-a, --access-key-id <type>', 'specify aws access key id')
    .option('-c, --cluster <type>', 'ECS cluster numbers')
    .option('-d, --debug', 'output extra debugging')
    .option('-g, --group-name <type>', 'specify group name of cloud-watch service')
    .option('-p, --profile <type>', 'aws credential profile')
    .option('-r, --region <type>', 'specify aws region')
    .option('-s, --secret-access-key <type>', 'specify aws secret access key')
    .option('-lc, --local-cache', 'use local cache, if data are stored in local environment')


    .on('--help', () => {
      console.info('');
      console.info('Example:');
      console.info('  $cw -a ${awsAccessKeyId} -s ${awsSecretAccessKey} -r ${awsRegion} -g ${groupName}');
      console.info('  $cw -p ${awsCredentialProfile} -r ${awsRegion} -g ${groupName}');
    });

  if (process.argv.length <= 2) {
    program.help();
  }

  program.parse(process.argv);

  if (program.debug) {
    process.env.VERBOSE = 'true';
  }

  if (program.profile) {
    AWS.config.credentials =
      new AWS.SharedIniFileCredentials({profile: program.profile});
  } else {
    if (!program.accessKeyId || !program.secretAccessKey) {
      program.help(helpful('Error: <-a, --access-key-id> <-s, --secret-access-key>'));
    } else {
      AWS.config.credentials =
        new AWS.Credentials(program.accessKeyId, program.secretAccessKey);
    }
  }

  if (!program.region) {
    program.help(helpful('Error: <-r, --region>'));
  }

  return program;
}