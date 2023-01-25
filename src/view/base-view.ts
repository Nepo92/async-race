class BaseView {
  root: HTMLElement = document.body;

  constructor() {
    this.root.innerHTML = "";
  }
}

export default BaseView;
