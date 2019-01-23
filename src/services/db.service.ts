import { Observable, Subscriber } from 'rxjs';
import * as mysql from 'mysql';
import { DatabaseConfigInterface } from '../interfaces/database-config.interface';

export class DbService {
  public connect(mysqlConfig?: DatabaseConfigInterface): Observable<mysql.Connection> {
    return new Observable((observer: Subscriber<mysql.Connection>) => {
      const connectConfig: mysql.ConnectionConfig = {
        host: mysqlConfig.host,
        port: mysqlConfig.port,
        user: mysqlConfig.user,
        password: mysqlConfig.password,
        database: mysqlConfig.database,
        charset: mysqlConfig.charset
      };

      mysql.createConnection(connectConfig).connect(function(err) {
        if (err) {
          return observer.error(new Error('Database does not exist'));
        }
        observer.next(mysql.createConnection(connectConfig));
      });
    });
  }
}
