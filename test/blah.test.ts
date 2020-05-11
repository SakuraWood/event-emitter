import emiter from '../src';

const fn = (msg: string) => {
  console.log('hello  ' + msg);
};

emiter.emit('hello', '1');
emiter.emitSticky('hello', '1');

emiter.on('hello', fn);
