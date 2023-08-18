import Client from './client.js';
export declare type Options = {
    host: string;
    port?: number;
    timeout?: number;
    events?: boolean;
};
export default class NikoHomeControl extends Client {
    constructor(options: Options);
    command(command: string): Promise<any>;
    listActions(): Promise<any>;
    listLocations(): Promise<any>;
    listEnergy(): Promise<any>;
    systemInfo(): Promise<any>;
    executeActions(id: any, value: any): Promise<any>;
}
