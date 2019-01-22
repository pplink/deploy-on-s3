import * as mysql from 'mysql';
import {Observable} from 'rxjs/internal/Observable';
import {of} from 'rxjs';
import {DatabaseConfigInterface} from '../interfaces/database-config.interface';

export class DbService {
  public connect(mysqlConfig?: DatabaseConfigInterface): Observable<mysql.Connection> {
    const connectConfig: mysql.ConnectionConfig = {
      host: mysqlConfig.host,
      port: mysqlConfig.port,
      user: mysqlConfig.user,
      password: mysqlConfig.password,
      database: mysqlConfig.database,
      charset: mysqlConfig.charset
    };
    return of(mysql.createConnection(connectConfig));
  }
}
