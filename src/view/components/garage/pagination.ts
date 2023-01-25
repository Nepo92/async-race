import GarageStore from "../../../model/garage-store/garage-store";
import BaseComponent from "../base-component";

const paginationTemplate = require("./templates/pagination.html");

class GaragePagination extends BaseComponent {
  private garageStore: GarageStore;

  public constructor(garageStore: GarageStore) {
    super({ tag: "div", className: ["container", "pagination"] });

    this.garageStore = garageStore;
  }

  protected template() {
    const container = document.createElement("template");

    container.innerHTML = paginationTemplate();

    return container.content;
  }

  public increasePaginationPage(callback: () => void) {
    const nextPage = document.querySelector(".garage-pagination__next");

    if (nextPage) {
      nextPage.addEventListener("click", callback);
    }
  }

  public decreasePaginationPage(callback: () => void) {
    const prevPage = document.querySelector(".garage-pagination__prev");

    if (prevPage) {
      prevPage.addEventListener("click", callback);
    }
  }

  public update() {}
}

export default GaragePagination;
