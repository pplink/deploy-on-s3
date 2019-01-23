import { Deploy } from './src/deploy';
import { DbService } from './src/services/db.service';
import { mergeMap, map, concatMap } from 'rxjs/operators';

if (process.argv.includes('--init')) {
  Deploy.init();
}

if (process.argv.includes('--execute')) {
  Deploy.getConfig()
    .pipe(concatMap(config => new Deploy(config, new DbService()).execute()))
    .subscribe();
}
