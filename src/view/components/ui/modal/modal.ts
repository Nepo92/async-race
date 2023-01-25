import BaseComponent from "../../base-component";
import { Car } from "../../../../model/types/garage";

const carModalTemplate = require("./templates/car-modal.html");

class Modal extends BaseComponent {
  car: Car | undefined;

  public constructor(car?: Car) {
    super({ tag: "div", className: ["modal"] });

    this.car = car;
  }

  protected template() {
    const template = document.createElement("template");

    return template.content;
  }

  public open(car: unknown) {
    const template = document.createElement("template");

    template.innerHTML = carModalTemplate({ car });

    document.body.append(template.content);

    const event = new Event("modal-open");
    dispatchEvent(event);
  }

  public close() {
    const modal = document.querySelector(".modal");

    if (modal) {
      modal.remove();
    }
  }

  public closeModalHandlers() {
    const modal = document.querySelector(".modal");

    if (modal) {
      modal.addEventListener("click", (e: Event) => {
        const t = e.target as HTMLElement;

        const isBack = t.classList.contains("modal");

        if (isBack) {
          modal.remove();
        }
      });
    }

    const cancelBtn = document.querySelector(".modal__button--cancel");

    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        const modal = document.querySelector(".modal");

        if (modal) {
          modal.remove();
        }
      });
    }
  }

  update() {}
}

export default Modal;
