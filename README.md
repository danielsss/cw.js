![introduce](https://github.com/danielsss/cw.js/blob/main/docs/introduce.gif)

# 🔥 cw.js

A command named "cw" that keeps reading latest cloudWatch log stream to local.

`cw.js` is written in `Typescript` and based on [AWS SDK](https://github.com/aws/aws-sdk-js) CloudWatchLogs.

## Install

```shell script
$ npm i -g cw.js
```

## Usage

```shell script
$ cw --access-key-id "*" --secret-access-key "*" --region "cn-north-1" --group-name "*"
```

* OR

```shell script
$ cw --profile "your profile name" --region "cn-north-1" --group-name "*"
```

Make sure the value of --profile is stored in [.aws/credentials](https://docs.amazonaws.cn/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html).

## Help

```shell script
$ cw --help
```