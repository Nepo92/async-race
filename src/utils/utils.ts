import { Car } from "../model/types/garage";

class Utils {
  public getCarProps(modalElem: HTMLElement) {
    const car = {} as Partial<Car>;
    const name = modalElem.querySelector(
      ".car-input__name"
    ) as HTMLInputElement;
    if (name) {
      car.name = name.value;
    }

    const colorPicker = modalElem.querySelector(
      ".car-input__color"
    ) as HTMLInputElement;
    if (colorPicker) {
      car.color = colorPicker.value;
    }

    return car;
  }

  public changeCarColor() {
    const inputColor = document.querySelector(".car-input__color");

    if (inputColor) {
      inputColor.addEventListener("input", (e: Event) => {
        const t = e.target as HTMLElement;
        const { value } = e.target as HTMLInputElement;

        const carImage = t
          .closest(".modal__form")
          ?.querySelector(".modal__right") as HTMLElement;

        if (carImage) {
          carImage.style.backgroundColor = value;
        }
      });
    }
  }

  public getCar(carItem?: Car) {
    let car;

    if (carItem) {
      car = carItem;
    } else {
      car = {
        name: "",
        color: "#000",
      };
    }

    return car;
  }
}

export default Utils;
