import { Deploy } from './src/deploy';
import { DbService } from './src/services/db.service';

if ( process.argv.includes('--init') ) {
  Deploy.init();
}

if ( process.argv.includes('--execute') ) {
  new Deploy(
  {
    deploy: {
      s3PublicKey: '',
      s3SecretKey: '',
      s3BucketName: '',
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
}


