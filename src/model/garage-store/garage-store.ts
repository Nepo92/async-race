import Store from "../store";
import { Car, IGarageStore } from "../types/garage";
import { IPagination } from "../types/garage";

class GarageStore extends Store {
  store: IGarageStore;
  pagination: IPagination;

  public constructor(garage: Array<Car>) {
    super();

    this.store = {
      garage: garage || [],
      generate: {
        cars: [
          "BMW",
          "Mercedes-Benz",
          "Volkswagen",
          "Opel",
          "Toyota",
          "Lexus",
          "Honda",
          "Mazda",
          "Ford",
          "Chevrolet",
        ],
        models: [
          "Model 7",
          "Gelandewagen",
          "Polo",
          "Astra",
          "Camry",
          "LS 350",
          "Accord",
          "Model 3",
          "Focus",
          "Lacetti",
        ],
      },
    };

    this.pagination = {
      limit: 7,
      page: 1,
    };
  }

  public get() {
    return this.store;
  }

  public getPagination() {
    return this.pagination;
  }

  public getWithPagination() {
    const { limit, page } = this.pagination;

    const [start, end] = this.getPaginationIndex(limit, page);

    return this.store.garage.slice(start, end);
  }

  private getPaginationIndex(limit: number, page: number) {
    const start = page === 1 ? 0 : (page - 1) * limit;
    const end = page === 1 ? limit : start + limit;

    return [start, end];
  }

  public updateCar(car: Car) {
    this.store.garage = this.store.garage.map((el) => {
      if (el.id === car.id) {
        return car;
      }

      return el;
    });

    this.notify();
  }

  public addCar(car: Car) {
    this.store.garage.push(car);
    this.notify();
  }

  public removeCar(car: Car) {
    const index = this.store.garage.findIndex((el) => el.id === car.id);

    if (index > -1) {
      this.store.garage.splice(index, 1);
      this.notify();
    }
  }

  public checkCars(pagination: IPagination) {
    const { limit, page } = pagination;

    const [start, end] = this.getPaginationIndex(limit, page);

    return this.store.garage.slice(start, end).length;
  }

  public increasePaginationPage() {
    this.pagination.page += 1;
    const cars = this.checkCars(this.pagination);

    if (!cars) {
      this.pagination.page -= 1;
    }

    this.notify();
  }

  public decreasePaginationPage() {
    this.pagination.page -= 1;

    if (this.pagination.page <= 0) {
      this.pagination.page = 1;
    }

    this.notify();
  }
}

export default GarageStore;
