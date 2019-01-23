import { Deploy } from './src/deploy';
import { DbService } from './src/services/db.service';

if ( process.argv.includes('--init') ) {
  Deploy.init();
}

if ( process.argv.includes('--execute') ) {
  new Deploy(
  Deploy.getConfig(),
  new DbService()
)
  .execute()
  .subscribe();
}


