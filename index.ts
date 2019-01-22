import { Deploy } from './src/deploy'
import { DbService } from './src/services/db.service';

new Deploy({ deploy: {
    s3PublicKey: '',
    s3SecretKey: '',
    s3BucketName:'',
    slackChannel: '',
    slackToken: '',
    packageJsonPath: '',
    bundleAbsoluteFilePath: ''
  }, database: {
    host: '',
    port: 1,
    user: '',
    password: '',
    database: '',
    charset: '',
    table: ''
  } }, 
  new DbService()
)