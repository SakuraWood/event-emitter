interface EventDict {
  [propName: string]: Event;
}

type PayLoadFunction = (payload?: any) => any;

interface EventAction {
  action: PayLoadFunction | null;
  key: number | string;
  once?: boolean;
  stickyPayloads?: Array<any>;
}

interface Event {
  action: Array<EventAction>;
  stickyPayloads?: Array<any>;
}

class EventEmitter {
  static instance: EventEmitter;

  eventDict: EventDict = {};

  static getDefault() {
    if (!EventEmitter.instance) {
      EventEmitter.instance = new EventEmitter();
    }
    return EventEmitter.instance;
  }

  fillDataIfNeed(key: string) {
    let event = this.eventDict[key];
    if (!event) {
      event = {} as Event;
      this.eventDict[key] = event;
    }
    let actionArray = this.eventDict[key].action;
    if (!actionArray) {
      actionArray = [];
      this.eventDict[key].action = actionArray;
    }
    return actionArray;
  }

  on(key: string, action: PayLoadFunction, once: boolean = false) {
    const actionArray = this.fillDataIfNeed(key);
    const { length } = actionArray;
    const eventAction: EventAction = { action, key: length, once };
    actionArray.push(eventAction);
    const item = actionArray[length] || ({} as EventAction);
    const stickyPayloads = this.eventDict[key].stickyPayloads || [];
    item.stickyPayloads = [...stickyPayloads];
    if (once) {
      const payload = item.stickyPayloads.shift();
      action && action(payload);
      delete item.action;
    } else {
      while (item.stickyPayloads.length > 0) {
        const payload = item.stickyPayloads.shift();
        action(payload);
      }
    }
  }

  once(key: string, action: PayLoadFunction) {
    this.on(key, action, true);
  }

  offAll() {
    this.eventDict = {};
  }

  offEvent(key: string) {
    delete this.eventDict[key];
  }

  off(key: string, action: PayLoadFunction) {
    const event = this.eventDict[key];
    if (!event) {
      return;
    }
    const actions = event.action;
    if (actions) {
      for (let i = 0, j = actions.length; i < j; i += 1) {
        const act = actions[i].action;
        if (act === action) {
          delete actions[i].action;
        }
      }
    }
  }

  emit(key: string, payload: any, isSticky: boolean = false) {
    const actionArray = this.fillDataIfNeed(key);
    if (isSticky) {
      let { stickyPayloads } = this.eventDict[key];
      if (!stickyPayloads) {
        stickyPayloads = [];
        this.eventDict[key].stickyPayloads = stickyPayloads;
      }
      stickyPayloads.push(payload);
    }
    for (let i = 0, j = actionArray.length; i < j; i += 1) {
      const item = actionArray[i];
      item.key = i;
      const { action } = item;
      action && action(payload);
      item.once && delete item.action;
    }
  }

  emitSticky(key: string, payload: any) {
    this.emit(key, payload, true);
  }
}

export default EventEmitter.getDefault();

export { EventEmitter };
