import { ComponentOptions } from "../types/component";
import Store from "../../model/store";

abstract class BaseComponent {
  protected container: HTMLElement;

  public constructor(options: Partial<ComponentOptions> = { tag: "div" }) {
    const { tag, className } = options;

    this.container = document.createElement(tag!) as HTMLElement;

    if (className?.length) {
      this.container.classList.add(...className);
    }
  }

  public render() {
    this.container.append(this.template());

    return this.container;
  }

  protected subscribe(store: Store) {
    store.attach(this);
  }

  protected abstract template(): DocumentFragment;
  public abstract update(): void;
}

export default BaseComponent;
