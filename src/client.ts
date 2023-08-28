import net from 'net'
import Events from 'events'

export default class Client extends Events {
  host: string
  port: number
  serverTimeout: EpochTimeStamp
  tcpClient: net.Socket

  constructor(options) {
    super()
    this.host = options.host;
    this.port = options.port;
    this.serverTimeout = options.timeout
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.tcpClient = net.connect({
        host: this.host,
        port: this.port
      })
      this.tcpClient.on('error', error => reject(error))
      this.tcpClient.on('connect', () => resolve(true))
    })
  }

  startEvents() {
    this.tcpClient.setKeepAlive(true);
    this.tcpClient.write('{"cmd": "startevents"}');
    this.tcpClient.on('data', (data: string) => {
      var eventBuffer = Buffer.from('', 'utf-8');
      eventBuffer = Buffer.concat([eventBuffer, Buffer.from(data, 'utf-8')]);
      this.#parseEvent(eventBuffer.toString());
      eventBuffer = null;
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
        const parsedEvent = parsed[index]
        this.emit(parsedEvent.event, { data: parsedEvent.data })
      }
    }
  }

  request = (line): Promise<string> => {
    return new Promise((resolve, reject) => {
      let buffer = Buffer.from('', 'utf-8');
      const lineSend = line + '\r\n'
  
      const client = net.connect({
        host: this.host,
        port: this.port
      }, () => {
        client.write(lineSend);
      })
      
      client.on('data', (data: string) => {
        buffer = Buffer.concat([buffer, Buffer.from(data, 'utf-8')]);
        client.end();
      })
  
      client.on('end', () => {
        resolve(buffer.toString());
      })

      client.on('error', (err) => {
        reject(err);
      })
  
      client.setTimeout(this.serverTimeout, () => {
        reject(new Error('TCP_TIME_OUT'));
      })
    })
  }
}
