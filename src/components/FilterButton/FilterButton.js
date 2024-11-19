import { getIconColor, loadComponent } from "../../utils.js";
import { NavBarItemsSelector } from "../../selectors.js";

export class FilterButton {
  componentElement = null;

  async render() {
    const componentElement = await loadComponent("FilterButton");

    // Set the icon color
    const path = componentElement.querySelector("path");
    path.setAttribute("fill", getIconColor());

    // Append the component to the desired location
    const targetContainer = document.querySelector(NavBarItemsSelector);

    // Append the component to the target container
    targetContainer.appendChild(componentElement);

    this.componentElement = componentElement;
  }

  addOnClick(callback) {
    this.componentElement.addEventListener("click", callback);
  }
}
