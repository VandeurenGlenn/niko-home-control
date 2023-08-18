import Client from './client.js';

export declare type Options = {
  host: string
  port?: number
  timeout?: number
  events?: boolean
}

const defaultOptions = {
  port: 8000,
  timeout: 20_000,
  events: true
}

const generateError = (errorCode) => {
  let errorMessage: 'NOT_FOUND' | 'SYNTAX_ERROR' | 'ERROR'

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

export default class NikoHomeControl extends Client {
  constructor(options: Options) {
    if (!options) throw new Error('atleast {host: yourhost/ip} is required got undefined')
    if (!options.host) throw new Error(`host required`)

    options = {...defaultOptions, ...options}
    super(options)
  }

  async command(command: string) {
    const response = await this.request(command)
    const result = JSON.parse(response)
    if (result.data.error > 0) {
      throw (generateError(result.data.error));
    }
    return result;
  }
  
  listActions() {
    return this.command('{"cmd": "listactions"}')
  }
  
  listLocations() {
    return this.command('{"cmd": "listlocations"}')
  }
  
  listEnergy() {
    return this.command('{"cmd": "listenergy"}')
  }
  
  systemInfo() {
    return this.command('{"cmd": "systeminfo"}')
  }
  
  executeActions(id, value) {
    return this.command('{"cmd": "executeactions", "id":' + id + ', "value1": ' + value + '}')
  }
}
