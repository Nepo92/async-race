export interface Car {
  color: string;
  name: string;
  id: number;
}

export interface IGarageStore {
  garage: Array<Car>;
  generate: {
    cars: Array<string>;
    models: Array<string>;
  };
}

export interface IPagination {
  limit: number;
  page: number;
}
