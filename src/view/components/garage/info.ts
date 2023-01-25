import GarageStore from "../../../model/garage-store/garage-store";
import BaseComponent from "../base-component";

const infoTemplate = require("./templates/info.html");

class GarageInfo extends BaseComponent {
  private garageStore: GarageStore;

  public constructor(garageStore: GarageStore) {
    super({ tag: "div", className: ["container", "garage__info"] });

    this.garageStore = garageStore;

    this.subscribe(this.garageStore);
  }

  protected template() {
    const container = document.createElement("template");

    const currentPage = this.garageStore.getPagination().page;

    const quantity = this.garageStore.get().garage.length;

    container.innerHTML = infoTemplate({ currentPage, quantity });

    return container.content;
  }

  public update() {
    const currentPage = this.garageStore.getPagination().page;
    const quantity = this.garageStore.get().garage.length;

    const page = document.querySelector(
      ".garage-info__value--page"
    ) as HTMLElement;

    if (page) {
      page.innerHTML = "" + currentPage;
    }

    const quantityElem = document.querySelector(
      ".garage-info__value--quantity"
    ) as HTMLElement;

    if (quantityElem) {
      quantityElem.innerHTML = "" + quantity;
    }
  }
}

export default GarageInfo;
