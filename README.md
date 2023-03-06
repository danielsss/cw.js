[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![](https://img.shields.io/github/package-json/v/danielsss/cw.js)

# 🔥Reading log streams from AWS CloudWatch 🔥

`cw.js` is written by `Typescript` and based on [AWS SDK](https://github.com/aws/aws-sdk-js) CloudWatchLogs and ECS.

It supports
reading logs in a cluster mode
which means you can read all tasks in a window and has also supported local cache for group names.


# Usage

Installing the `cw.js` as a global package.

```shell script
$ npm i -g cw.js
```

```shell script
$ cw --profile en --region us-east-1
```

```shell
cw --help
Usage: cw [Options]

Options:
  -V, --version                   output the version number
  -a, --access-key-id <type>      specify aws access key id
  -c, --cluster <type>            ECS cluster numbers
  -d, --debug                     output extra debugging
  -g, --group-name <type>         specify group name of cloud-watch service
  -p, --profile <type>            aws credential profile
  -r, --region <type>             specify aws region
  -s, --secret-access-key <type>  specify aws secret access key
  -lc, --local-cache              use local cache, if data are stored in local environment
  -h, --help                      display help for command

Example:
  $cw -a ${awsAccessKeyId} -s ${awsSecretAccessKey} -r ${awsRegion} -g ${groupName}
  $cw -p ${awsCredentialProfile} -r ${awsRegion} -g ${groupName}
```

There is a thing you need to know which makes sure the [credentials](https://docs.amazonaws.cn/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html) are stored to local configuration if you are going to use `--profile`.
