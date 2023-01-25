import BaseComponent from "../base-component";

const navBarTemplate = require("./tempaltes/nav-bar.html");

class NavBar extends BaseComponent {
  public constructor() {
    super({
      tag: "nav",
      className: ["container", "nav"],
    });
  }

  protected template() {
    const container = document.createElement("template");

    container.innerHTML = navBarTemplate();

    return container.content;
  }

  public clickNavLink(callback: (href: string) => void) {
    this.container.addEventListener("click", (e: Event) => {
      const target = e.target as HTMLElement;

      if (target) {
        const href = target.getAttribute("href");

        if (href) {
          e.preventDefault();

          callback(href);
        }
      }
    });
  }

  public update() {}
}

export default NavBar;
