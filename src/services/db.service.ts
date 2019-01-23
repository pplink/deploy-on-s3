import * as mysql from 'mysql';
import { Observable, Subscriber } from 'rxjs';
import { concatMap } from 'rxjs/operators';
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

  public createTableColumn(databaseOptions: DatabaseConfigInterface): Observable<DatabaseConfigInterface> {
    return this.connect(databaseOptions).pipe(
      concatMap(
        sql =>
          new Observable((observer: Subscriber<DatabaseConfigInterface>) => {
            sql.query(
              `CREATE TABLE IF NOT EXISTS ${databaseOptions.database}.${databaseOptions.column} (
                id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                packageName VARCHAR(255) NOT NULL,
                version VARCHAR(255) NOT NULL,
                hashKey VARCHAR(255) NOT NULL,
                createdAt DATETIME DEFAULT now()
              )`,
              (err, result) => {
                this.disConnect(sql);
                if (err) {
                  observer.error(err);
                }
                observer.next(databaseOptions);
              }
            );
          })
      )
    );
  }

  public insertRecord(
    databaseOptions: DatabaseConfigInterface,
    queryData: { name: string; version: string; s3HashKey: string }
  ): Observable<{ id: number; options: DatabaseConfigInterface }> {
    return this.connect(databaseOptions).pipe(
      concatMap(
        sql =>
          new Observable((observer: Subscriber<{ id: number; options: DatabaseConfigInterface }>) => {
            sql.query(
              `INSERT INTO ${databaseOptions.database}.${databaseOptions.column} (packageName, version, hashKey) VALUES (
                '${queryData.name}', '${queryData.version}', '${queryData.s3HashKey}'
              )`,
              (err, result) => {
                this.disConnect(sql);
                if (err) {
                  observer.error(err);
                }
                observer.next({ id: result.insertId, options: databaseOptions });
              }
            );
          })
      )
    );
  }

  public countRecord(databaseOptions: DatabaseConfigInterface, s3HashKey: string, id: number): Observable<{ id: number; count: number }> {
    return this.connect(databaseOptions).pipe(
      concatMap(
        sql =>
          new Observable((observer: Subscriber<{ id: number; count: number }>) => {
            sql.query(
              `SELECT COUNT(*) FROM ${databaseOptions.database}.${databaseOptions.column} WHERE hashKey = '${s3HashKey}'`,
              (err: mysql.MysqlError, result) => {
                this.disConnect(sql);
                if (err) {
                  return observer.error(err);
                }
                observer.next({ id, count: result[0]['COUNT(*)'] });
              }
            );
          })
      )
    );
  }

  public disConnect(connection: mysql.Connection): void {
    connection.end();
  }
}
