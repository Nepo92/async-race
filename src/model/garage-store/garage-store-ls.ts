import { Car } from "../types/garage";

class GarageStoreLS {
  name = process.env.NODE_LOCAL_STORAGE_NAME;

  public set(garage: Array<Car>) {
    const stringifyGarage = JSON.stringify(garage);

    localStorage.setItem(this.name!, stringifyGarage);
  }

  public get() {
    const garage = localStorage.getItem(this.name!);

    if (garage) {
      return JSON.parse(garage);
    }

    return [];
  }
}

export default GarageStoreLS;
