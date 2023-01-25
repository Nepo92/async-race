import Router from "vanilla-router";
import WinnersView from "../view/winners-view";
import API from "../api/api";

import "../assets/scss/winners.scss";

class WinnersController {
  router: Router;
  view: WinnersView;
  api: API;

  constructor(router: Router) {
    this.router = router;
    this.view = new WinnersView();
    this.api = new API();
  }

  async init() {
    const winners = await this.api.fetch("/winners");

    this.view.init();

    this.view.clickNavLink((href: string) => {
      this.router.navigateTo(href);
    });
  }
}

export default WinnersController;
