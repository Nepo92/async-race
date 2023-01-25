import BaseView from "./base-view";
import NavBar from "./components/nav-bar/nav-bar";
import GarageInfo from "./components/garage/info";
import GarageStore from "../model/garage-store/garage-store";
import { Car } from "../model/types/garage";
import GarageNav from "./components/garage/nav";
import GarageTrack from "./components/garage/track";
import GaragePagination from "./components/garage/pagination";
import Utils from "../utils/utils";
import Modal from "./components/ui/modal/modal";

class GarageView extends BaseView {
  private navBar: NavBar;
  private garageStore: GarageStore;
  private garageInfo: GarageInfo;
  private garageNav: GarageNav;
  private garageTrack: GarageTrack;
  private garagePagination: GaragePagination;
  private utils: Utils;
  private modal: Modal;

  public constructor(garageStore: GarageStore) {
    super();

    this.garageStore = garageStore;
    this.navBar = new NavBar();
    this.garageInfo = new GarageInfo(this.garageStore);
    this.garageNav = new GarageNav(this.garageStore);
    this.garageTrack = new GarageTrack(this.garageStore);
    this.garagePagination = new GaragePagination(this.garageStore);
    this.utils = new Utils();
    this.modal = new Modal();
  }

  public init() {
    this.root.append(this.navBar.render());
    this.root.append(this.garageInfo.render());
    this.root.append(this.garageNav.render());
    this.root.append(this.garageTrack.render());
    this.root.append(this.garagePagination.render());

    window.addEventListener("modal-open", () => {
      this.utils.changeCarColor();
      this.modal.closeModalHandlers();
    });
  }

  public clickNavLink(callback: (href: string) => void) {
    this.navBar.clickNavLink(callback);
  }

  public createCar(callback: (car: Partial<Car>) => Promise<void>) {
    this.garageNav.createCar(callback);
  }

  public generate100Cars(callback: (car: Partial<Car>) => Promise<void>) {
    this.garageNav.generate100Cars(callback);
  }

  public removeCar(callback: (car: Car) => Promise<void>) {
    const garageList = document.querySelector(".garage__list");

    if (garageList) {
      garageList.addEventListener("click", (e: Event) => {
        const t = e.target as HTMLElement;

        const isRemoveCar = t.classList.contains("car-nav__button--remove");

        if (isRemoveCar) {
          this.garageTrack.removeCar(callback, e);
        }
      });
    }
  }

  public updateCar(callback: (car: Car) => Promise<void>) {
    const garageList = document.querySelector(".garage__list");

    if (garageList) {
      garageList.addEventListener("click", (e: Event) => {
        const t = e.target as HTMLElement;

        const isUpdate = t.classList.contains("car-nav__button--update");

        if (isUpdate) {
          this.garageTrack.updateCar(callback, e);
        }
      });
    }
  }

  public startDrive(callback: (car: Car) => Promise<unknown>) {
    const garageList = document.querySelector(".garage__list");

    if (garageList) {
      garageList.addEventListener("click", (e: Event) => {
        const t = e.target as HTMLElement;

        const isStartEngine = t.classList.contains("car-engine__start");

        if (isStartEngine) {
          this.garageTrack.startEngine(callback, e);
        }
      });
    }
  }

  public stopEngine(callback: (car: Car) => Promise<void>) {
    const garageList = document.querySelector(".garage__list");

    if (garageList) {
      garageList.addEventListener("click", (e: Event) => {
        const t = e.target as HTMLElement;

        const isStopEngine = t.classList.contains("car-engine__stop");

        if (isStopEngine) {
          this.garageTrack.stopEngine(callback, e);
        }
      });
    }
  }

  public increasePaginationPage(callback: () => void) {
    this.garagePagination.increasePaginationPage(callback);
  }

  public startRace(
    callback: (
      cars: Array<Car>,
      stopCb: (car: Car, isError?: boolean) => void,
      startCb: (car: Car) => void
    ) => Promise<unknown>
  ) {
    this.garageTrack.startRace(callback);
  }

  public decreasePaginationPage(callback: () => void) {
    this.garagePagination.decreasePaginationPage(callback);
  }

  public stopRace(callback: (cars: Array<Car>) => Promise<unknown>) {
    this.garageTrack.stopRace(callback);
  }
}

export default GarageView;
