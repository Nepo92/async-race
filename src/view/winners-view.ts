import BaseView from "./base-view";
import NavBar from "./components/nav-bar/nav-bar";
import Winners from "./components/winners/winners";

class WinnersView extends BaseView {
  private navBar: NavBar;
  private winners: Winners;

  public constructor() {
    super();

    this.navBar = new NavBar();
    this.winners = new Winners();
  }

  public init() {
    this.root.append(this.navBar.render());
    this.root.append(this.winners.render());
  }

  public clickNavLink(callback: (href: string) => void) {
    this.navBar.clickNavLink(callback);
  }
}

export default WinnersView;
