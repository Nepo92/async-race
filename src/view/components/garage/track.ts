import BaseComponent from "../base-component";
import { Car } from "../../../model/types/garage";
import GarageStore from "../../../model/garage-store/garage-store";
import Modal from "../ui/modal/modal";
import Utils from "../../../utils/utils";
import { ICarTrack } from "../../../model/types/track";

const trackTemplate = require("./templates/track.html");
const carTemplate = require("./templates/car-item.html");

class GarageTrack extends BaseComponent {
  private garageStore: GarageStore;
  private utils: Utils;
  private intervals: Array<ICarTrack>;
  private interval: number;
  private raceArr: Array<Car>;

  constructor(garageStore: GarageStore) {
    super({ tag: "ul", className: ["container", "garage__list"] });

    this.garageStore = garageStore;
    this.utils = new Utils();
    this.intervals = [];
    this.interval = 0;
    this.raceArr = [];

    this.subscribe(this.garageStore);
  }

  protected template() {
    const container = document.createElement("template");

    const cars = this.garageStore.getWithPagination();
    const carItems = cars.map((car) => carTemplate({ car })).join("");

    container.innerHTML = trackTemplate({ carItems });

    return container.content;
  }

  public removeCar(callback: (car: Car) => void, e: Event) {
    const t = e.target as HTMLElement;

    const id = t.dataset.id;

    if (id) {
      const car = this.garageStore.get().garage.find((el) => el.id === +id);

      if (car) {
        callback(car);
      }
    }
  }

  public updateCar(callback: (car: Car) => void, e: Event) {
    const t = e.target as HTMLElement;

    const id = t.dataset.id;

    if (id) {
      const car = this.garageStore.get().garage.find((el) => el.id === +id);

      if (car) {
        const modal = new Modal(car);

        const carItem = this.utils.getCar(car);

        modal.open(carItem);

        const modalElem = document.querySelector(".modal") as HTMLElement;

        if (modalElem) {
          const updateBtn = document.querySelector(".modal__button--apply");

          if (updateBtn) {
            updateBtn.addEventListener("click", async (event: Event) => {
              event.preventDefault();

              const updatedProps = this.utils.getCarProps(modalElem);
              const updatedCar = Object.assign(car, updatedProps);

              await callback(updatedCar);
              modal.close();
            });
          }
        }
      }
    }
  }

  public async startEngine(
    startCallback: (car: Car) => Promise<unknown>,
    e: Event
  ) {
    const t = e.target as HTMLElement;

    const id = t.dataset.id;

    if (id) {
      const car = this.garageStore.get().garage.find((el) => el.id === +id);

      if (car) {
        t.setAttribute("disabled", "");

        const stopBtn = document.querySelector(
          `.car-engine__stop[data-id="${car.id}"]`
        );

        if (stopBtn) {
          stopBtn.removeAttribute("disabled");
        }

        try {
          const startRace = this.startRaceAnimation.bind(this);

          const carImage = document.querySelector(
            `.car__image[data-id="${car.id}"]`
          ) as HTMLElement;

          const finish = document.querySelector(
            `.car__finish[data-id="${car.id}"]`
          ) as HTMLElement;

          this.interval = setInterval(() => {
            startRace(finish, carImage, Math.random() * 5);
          }, 50) as unknown as number;

          const response = await startCallback(car);

          if (response) {
            clearTimeout(this.interval);
          }
        } catch {
          clearInterval(this.interval);
        }
      }
    }
  }

  public async stopEngine(callback: (car: Car) => void, e: Event) {
    const t = e.target as HTMLElement;

    const id = t.dataset.id;

    if (id) {
      const car = this.garageStore.get().garage.find((el) => el.id === +id);

      const carWrapper = t.closest(".car");

      if (carWrapper) {
        const carImage = carWrapper.querySelector(".car__image") as HTMLElement;

        const startButton = carWrapper.querySelector(
          ".car-engine__start"
        ) as HTMLElement;

        if (car) {
          try {
            await callback(car);
            clearInterval(this.interval);

            const currentCar = this.intervals.find((el) => el.id === car.id);

            if (currentCar) {
              clearInterval(currentCar.race);
            }

            carImage.style.left = "60px";
            startButton.removeAttribute("disabled");

            const stopBtn = carWrapper.querySelector(".car-engine__stop");

            if (stopBtn) {
              stopBtn.setAttribute("disabled", "");
            }
          } catch {
            throw new Error("Error when stop a callback");
          }
        }
      }
    }
  }

  public startRace(
    callback: (
      cars: Array<Car>,
      stopCb: (car: Car) => void,
      startCb: (car: Car) => void
    ) => Promise<unknown>
  ) {
    const startBtn = document.querySelector(".start-race");

    if (startBtn) {
      const cars = this.garageStore.getWithPagination();

      startBtn.addEventListener("click", async (e) => {
        const t = e.target as HTMLElement;

        t.setAttribute("disabled", "");

        const stopRace = document.querySelector(".stop-race");

        if (stopRace) {
          stopRace.removeAttribute("disabled");
        }

        const startButtons = document.querySelectorAll(".car-engine__start");

        if (startButtons.length) {
          startButtons.forEach((item) => {
            item.setAttribute("disabled", "");
          });
        }

        const stopButtons = document.querySelectorAll(".car-engine__stop");

        if (stopButtons.length) {
          stopButtons.forEach((item) => {
            item.removeAttribute("disabled");
          });
        }

        const startCb = this.startCb.bind(this);
        const stopCb = this.stopCb.bind(this);

        await callback(cars, stopCb, startCb);
      });
    }
  }

  private async startCb(car: Car) {
    const carImage = document.querySelector(
      `.car__image[data-id="${car.id}"]`
    ) as HTMLElement;
    const carFinish = document.querySelector(
      `.car__finish[data-id="${car.id}"]`
    ) as HTMLElement;

    if (carImage && carFinish) {
      const startRace = this.startRaceAnimation.bind(this);
      const stopCb = this.stopCb.bind(this);

      let driving;

      const interval = setInterval(() => {
        driving = startRace(carFinish, carImage, Math.random() * 5);

        if (!driving) {
          stopCb(car, false, true);
        }
      }, 50) as unknown as number;

      this.intervals.push({
        id: car.id,
        race: interval,
      });
    }
  }

  public startRaceAnimation(
    finish: HTMLElement,
    carImage: HTMLElement,
    speed: number
  ) {
    const end = parseInt(window.getComputedStyle(finish).left);

    const pos = parseInt(window.getComputedStyle(carImage).left);

    if (end >= pos) {
      carImage.style.left =
        parseInt(window.getComputedStyle(carImage).left) + 5 * speed + "px";

      return true;
    }
  }

  private stopCb(
    car: Car,
    isError: boolean = false,
    isFinish: boolean = false
  ) {
    const currentCar = this.intervals.find((el) => el.id === car.id);

    if (currentCar) {
      clearInterval(currentCar.race);
    }

    if (!isError && isFinish) {
      this.raceArr.push(car);

      if (this.raceArr.length === 1) {
        alert(`Winner is ${car.name}`);
      }

      return;
    }
  }

  public stopRace(callback: (cars: Array<Car>) => Promise<unknown>) {
    const cars = this.garageStore.getWithPagination();

    const stopRaceBtn = document.querySelector(".stop-race") as HTMLElement;

    if (stopRaceBtn) {
      stopRaceBtn.addEventListener("click", (e) => {
        const t = e.target as HTMLElement;

        t.setAttribute("disabled", "");

        const stopBtns = this.container.querySelectorAll(".car-engine__stop");

        if (stopBtns) {
          stopBtns.forEach((item) => (item as HTMLElement).click());
        }
      });
    }
  }

  public update() {
    const list = document.querySelector(".garage__list") as HTMLElement;

    if (list) {
      list.innerHTML = "";

      list.append(this.template());
    }
  }
}

export default GarageTrack;
