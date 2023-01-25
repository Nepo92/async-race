import { Subscriber } from "./types/store";

class Store {
  subscribers: Array<Subscriber> = [];

  attach(subscriber: Subscriber) {
    const isNewSubscriber = this.subscribers.indexOf(subscriber) === -1;

    if (isNewSubscriber) {
      this.subscribers.push(subscriber);
    }
  }

  detach(subscriber: Subscriber) {
    const index = this.subscribers.indexOf(subscriber);

    if (index > -1) {
      this.subscribers.splice(index, 1);
    }
  }

  notify() {
    this.subscribers.forEach((el) => el.update(this));
  }
}

export default Store;
