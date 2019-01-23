import { Deploy } from './src/deploy';
import { DbService } from './src/services/db.service';

new Deploy(
  {
    deploy: {
      s3PublicKey: '',
      s3SecretKey: '',
      s3BucketName: '',
      slackBotName: '',
      slackChannel: '',
      slackToken: '',
      packageJsonPath: '',
      bundleAbsoluteFilePath: ''
    },
    database: {
      host: '',
      port: 1,
      user: '',
      password: '',
      database: '',
      charset: '',
      column: ''
    }
  },
  new DbService()
)
  .execute()
  .subscribe();
