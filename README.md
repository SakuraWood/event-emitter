# event emitter

> A event bus for Javascript , support sticky event. gzip only 643B

## Install

```
  npm install @sakurawood/event-emitter

  // or

  yarn add @sakurawood/event-emitter
```

## Usage

```javascript
import emitter from '@sakurawood/event-emitter';
```

```javascript
const fn = msg => {
  console.log('Hi', msg);
};

// register event & handler
emitter.on('hello', fn);

// emit a event
emitter.emit('hello', 'John');

// emit a sticky event
emitter.emitSticky('hello', 'Max');

// unregister a event & handler
emitter.off('hello', fn);

// unregister a event & all of its handlers
emitter.offEvent('hello');

// unregister all events
emitter.offAll();
```
