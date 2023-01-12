[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[](https://img.shields.io/github/package-json/v/danielsss/cw.js)

# 🔥Reading log streams from AWS CloudWatch 🔥

`cw.js` is written by `Typescript` and based on [AWS SDK](https://github.com/aws/aws-sdk-js) CloudWatchLogs and ECS.

It supports reading logs in a cluster mode which means you can read all tasks in a window.


# Usage

Installing the `cw.js` as a global package.

```shell script
$ npm i -g cw.js
```

```shell script
$ cw --profile en --region us-east-1
```

There is a thing you need to know which makes sure the [credentials](https://docs.amazonaws.cn/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html) are stored to local configuration if you are going to use `--profile`.
