# Connector for the Niko Home Control API

[![Known Vulnerabilities](https://snyk.io/test/github/vandeurenglenn/niko-home-control/badge.svg)](https://snyk.io/test/github/vandeurenglenn/niko-home-control)

## Init

```js
import NikoHomeControl  from '@vandeurenglenn/niko-home-control';

const niko = new NikoHomeControl({
  ip: '0.0.0.0',
  port: 8000,
  timeout: 20000,
  events: true
});

try {
  await niko.connect()
} catch (error) {
  console.error(error)
}
```

`events` enables direct events from the controller, such as energy consumption and actions states.

## Usage

### Get the list of available locations

```js
await niko.listLocations()
```

### Get the list of available actions

```js
await niko.listActions()
```

### Perform an action

```js
await niko.executeActions(id, value)
```


### Get energy info

```js
await niko.listEnergy()
```

### Get system info

```js
await niko.systemInfo()
```

### Reveive energy consumption events

```js
niko.on('getlive', (data) => {
  console.log(data, 'live');
});
```

### Reveive actions states events

```js
niko.on('listactions', (data) => {
  console.log(data, 'actions');
});
```

TODO: notice parts of code and readme come from Louis Borsu <sat@satprod.net> github/satblip/niko-home-control