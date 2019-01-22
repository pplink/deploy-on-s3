import * as mysql from 'mysql';
import {Observable} from 'rxjs/internal/Observable';
import * as net from "net";
import {from} from 'rxjs/internal/observable/from';

export class DbService {
  public connect(): Observable<net.Socket> {
     return from(mysql.createConnection({
       host: '',
       user: '',
       password: '',
       database: ''
     }))
  }

}