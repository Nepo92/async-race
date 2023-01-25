import BaseComponent from "../base-component";

class Winners extends BaseComponent {
  public constructor() {
    super({
      tag: "main",
      className: ["winners"],
    });
  }

  protected template() {
    const container = document.createElement("template");

    container.innerHTML = "winners";

    return container.content;
  }

  public update() {}
}

export default Winners;
