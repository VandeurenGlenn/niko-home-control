/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import net from 'net';
import Events from 'events';
export default class Client extends Events {
    #private;
    host: string;
    port: number;
    serverTimeout: EpochTimeStamp;
    tcpClient: net.Socket;
    eventsEnabled: boolean;
    constructor(options: any);
    connect(): Promise<unknown>;
    request: (line: any) => Promise<string>;
}
