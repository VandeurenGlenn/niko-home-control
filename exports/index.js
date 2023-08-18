import net from 'net';
import Events from 'events';

class Client extends Events {
    constructor(options) {
        super();
        this.request = (line) => {
            return new Promise((resolve, reject) => {
                let buffer = Buffer.from('', 'utf-8');
                const lineSend = line + '\r\n';
                const client = net.connect({
                    host: this.host,
                    port: this.port
                }, () => {
                    client.write(lineSend);
                });
                // Still have to figure how to work with long responses
                client.on('data', (data) => {
                    buffer = Buffer.concat([buffer, Buffer.from(data, 'utf-8')]);
                    client.end();
                });
                client.on('end', () => {
                    resolve(buffer.toString());
                });
                client.on('error', (err) => {
                    reject(err);
                });
                client.setTimeout(this.serverTimeout, () => {
                    reject(new Error('TCP_TIME_OUT'));
                });
            });
        };
        this.host = options.host;
        this.port = options.port;
        this.serverTimeout = options.timeout;
        this.tcpClient = net.connect({
            host: this.host,
            port: this.port
        }, () => {
            if (options.events) {
                this.tcpClient.setKeepAlive(true);
                this.tcpClient.write('{"cmd": "startevents"}');
                this.tcpClient.on('data', (data) => {
                    var eventBuffer = Buffer.from('', 'utf-8');
                    eventBuffer = Buffer.concat([eventBuffer, Buffer.from(data, 'utf-8')]);
                    this.#parseEvent(eventBuffer.toString());
                    eventBuffer = null;
                });
            }
        });
    }
    #parseEvent(event) {
        if (event.indexOf('getlive') > 0 || event.indexOf('listactions') > 0) {
            event = event.replace(/\\n/g, '\\n')
                .replace(/\\'/g, "\\'")
                .replace(/\\"/g, '\\"')
                .replace(/\\&/g, '\\&')
                .replace(/\\r/g, '\\r')
                .replace(/\\t/g, '\\t')
                .replace(/\\b/g, '\\b')
                .replace(/\\f/g, '\\f');
            event = event.replace(/[\u0000-\u001F]+/g, '');
            event = '[' + event.replace(/}{/g, '},{') + ']';
            const parsed = JSON.parse(event);
            for (var index = 0, len = parsed.length; index < len; index++) {
                const parsedEvent = parsed[index];
                this.emit(parsedEvent.event, { data: parsedEvent.data });
            }
        }
    }
}

const defaultOptions = {
    port: 8000,
    timeout: 20_000,
    events: true
};
const generateError = (errorCode) => {
    let errorMessage;
    switch (errorCode) {
        case 100:
            errorMessage = 'NOT_FOUND';
            break;
        case 200:
            errorMessage = 'SYNTAX_ERROR';
            break;
        default:
            errorMessage = 'ERROR';
    }
    return new Error(errorMessage);
};
class NikoHomeControl extends Client {
    constructor(options) {
        if (!options)
            throw new Error('atleast {ip: yourhost/ip} is required got undefined');
        if (!options.host)
            throw new Error(`ip required`);
        options = { ...defaultOptions, ...options };
        super(options);
    }
    async command(command) {
        const response = await this.request(command);
        const result = JSON.parse(response);
        if (result.data.error > 0) {
            throw (generateError(result.data.error));
        }
        return result;
    }
    listActions() {
        return this.command('{"cmd": "listactions"}');
    }
    listLocations() {
        return this.command('{"cmd": "listlocations"}');
    }
    listEnergy() {
        return this.command('{"cmd": "listenergy"}');
    }
    systemInfo() {
        return this.command('{"cmd": "systeminfo"}');
    }
    executeActions(id, value) {
        return this.command('{"cmd": "executeactions", "id":' + id + ', "value1": ' + value + '}');
    }
}

export { NikoHomeControl as default };
