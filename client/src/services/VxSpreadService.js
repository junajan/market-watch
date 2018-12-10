import EventEmitter from 'events';

class VxSpread extends EventEmitter {
  onTermStructure(listener) {
    this.on(this.tsCode, listener);
  }

  offTermStructure(listener) {
    this.removeListener(this.tsCode, listener);
  }
}

export default new VxSpread();
