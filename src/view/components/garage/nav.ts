import GarageStore from "../../../model/garage-store/garage-store";
import BaseComponent from "../base-component";
import { Car } from "../../../model/types/garage";
import Modal from "../ui/modal/modal";
import Utils from "../../../utils/utils";

const navTemplate = require("./templates/nav.html");

class GarageNav extends BaseComponent {
  private garageStore: GarageStore;
  private utils: Utils;

  public constructor(garageStore: GarageStore) {
    super({ tag: "div", className: ["container", "garage__nav"] });

    this.garageStore = garageStore;
    this.utils = new Utils();
  }

  protected template() {
    const container = document.createElement("template");

    container.innerHTML = navTemplate();

    return container.content;
  }

  public generate100Cars(callback: (car: Partial<Car>) => Promise<void>) {
    const generate = this.container.querySelector(".generate-cars");

    if (generate) {
      generate.addEventListener("click", async (e: Event) => {
        const { cars, models } = this.garageStore.get().generate;

        for (let i = 0; i < 100; i++) {
          const car = {} as Partial<Car>;

          const randomCar = cars[Math.floor(Math.random() * cars.length)];
          const randomModel = models[Math.floor(Math.random() * models.length)];

          car.name = randomCar + " " + randomModel;

          const randomColor = Math.floor(Math.random() * 16777215).toString(16);
          car.color = "#" + randomColor;

          await callback(car);
        }
      });
    }
  }

  public createCar(callback: (car: Partial<Car>) => void) {
    const createCar = this.container.querySelector(".create-car");

    if (createCar) {
      createCar.addEventListener("click", () => {
        const modal = new Modal();

        const car = this.utils.getCar();

        modal.open(car);

        const apply = document.querySelector(".modal__button--apply");

        if (apply) {
          apply.addEventListener("click", async (e: Event) => {
            e.preventDefault();

            const modalElem = document.querySelector(".modal") as HTMLElement;

            if (modalElem) {
              const car = this.utils.getCarProps(modalElem);

              if (car.name && car.color) {
                await callback(car);
                modal.close();
              }
            }
          });
        }
      });
    }
  }

  public update() {}
}

export default GarageNav;
