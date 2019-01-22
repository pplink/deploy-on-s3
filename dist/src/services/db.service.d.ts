/// <reference types="node" />
import { Observable } from 'rxjs/internal/Observable';
import * as net from "net";
export declare class DbService {
    connect(): Observable<net.Socket>;
}
