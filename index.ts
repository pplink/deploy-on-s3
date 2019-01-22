import { Deploy } from './src/deploy'

new Deploy({
  s3PublicKey: '',
  s3SecretKey: '',
  s3BucketName:'',
  slackChannel: '',
  slackToken: '',
  packageJsonPath: '',
  bundleAbsoluteFilePath: ''
}).execute().subscribe();


