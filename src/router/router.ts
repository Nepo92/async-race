import Router from "vanilla-router";
import { Routers } from "./routers";
import GarageController from "../controller/garage-controller";
import WinnersController from "../controller/winners-controller";

const router = new Router({
  mode: "history",
  page404() {
    router.navigateTo(Routers.GARAGE);
  },
});

router.add(Routers.MAIN, () => {
  router.navigateTo(Routers.GARAGE);
});

router.add(Routers.GARAGE, () => {
  const controller = new GarageController(router);

  controller.init();
});

router.add(Routers.WINNERS, () => {
  const controller = new WinnersController(router);

  controller.init();
});

export default () => {
  router.check();
};
