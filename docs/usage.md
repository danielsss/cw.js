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


### Use `--help` for all options