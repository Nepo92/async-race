import Router from "vanilla-router";
import GarageView from "../view/garage-view";
import API from "../api/api";
import GarageStore from "../model/garage-store/garage-store";
import GarageStoreLS from "../model/garage-store/garage-store-ls";
import { Car } from "../model/types/garage";

import "../assets/scss/garage.scss";

class GarageController {
  router: Router;
  api: API;
  garageStoreLS: GarageStoreLS;

  public constructor(router: Router) {
    this.router = router;
    this.api = new API();
    this.garageStoreLS = new GarageStoreLS();
  }

  public async init() {
    let cars = this.garageStoreLS.get();

    if (!cars.length) {
      cars = await this.api.fetch("/garage", {
        method: "GET",
      });

      this.garageStoreLS.set(cars);
    }

    const garageStore = new GarageStore(cars);

    const view = new GarageView(garageStore);

    view.init();

    view.clickNavLink((href: string) => {
      this.router.navigateTo(href);
    });

    view.createCar(async (car: Partial<Car>) => {
      const params = {
        method: "POST",
        body: car,
      };

      const response = (await this.api.fetch("/garage", params)) as Car;

      garageStore.addCar(response);

      this.garageStoreLS.set(garageStore.get().garage);
    });

    view.generate100Cars(async (car: Partial<Car>) => {
      const params = {
        method: "POST",
        body: car,
      };

      const response = (await this.api.fetch("/garage", params)) as Car;

      garageStore.addCar(response);
      this.garageStoreLS.set(garageStore.get().garage);
    });

    view.removeCar(async (car: Car) => {
      await this.api.fetch("/garage/" + car.id, {
        method: "DELETE",
      });

      garageStore.removeCar(car);
      this.garageStoreLS.set(garageStore.get().garage);
    });

    view.updateCar(async (car: Car) => {
      await this.api.fetch("/garage/" + car.id, { method: "PUT" });

      garageStore.updateCar(car);
      this.garageStoreLS.set(garageStore.get().garage);
    });

    view.startDrive(async (car: Car) => {
      try {
        await this.api.fetch("/engine?id=" + car.id + "&status=started", {
          method: "PATCH",
        });

        await this.api.fetch("/engine?id=" + car.id + "&status=drive", {
          method: "PATCH",
        });

        return true;
      } catch {
        throw new Error("Error in a drive mode");
      }
    });

    view.stopEngine(async (car: Car) => {
      await this.api.fetch("/engine?id=" + car.id + "&status=stopped", {
        method: "PATCH",
      });
    });

    view.increasePaginationPage(() => {
      garageStore.increasePaginationPage();
    });

    view.decreasePaginationPage(() => {
      garageStore.decreasePaginationPage();
    });

    view.startRace(
      async (
        cars: Array<Car>,
        stopCb: (car: Car, isError?: boolean) => void,
        startCb: (car: Car) => void
      ) => {
        const api = this.api;

        const start = cars.map(async (item) => {
          await api.fetch("/engine?id=" + item.id + "&status=started", {
            method: "PATCH",
          });

          return item;
        });

        await Promise.all([start]);

        cars.forEach(async (item) => {
          try {
            startCb(item);
            await this.api.fetch("/engine?id=" + item.id + "&status=drive", {
              method: "PATCH",
            });

            stopCb(item);
          } catch {
            stopCb(item, true);
          }
        });
      }
    );

    view.stopRace(async (cars: Array<Car>) => {
      // const stop = cars.map(async (item) => {
      //   return await this.api.fetch(
      //     "/engine?id=" + item.id + "&status=stopped",
      //     {
      //       method: "PATCH",
      //     }
      //   );
      // });
      // Promise.all([stop]);
    });
  }
}

export default GarageController;
