import { Observable } from 'rxjs';
import * as mysql from 'mysql';
import { DatabaseConfigInterface } from '../interfaces/database-config.interface';
export declare class DbService {
    connect(mysqlConfig?: DatabaseConfigInterface): Observable<mysql.Connection>;
}
