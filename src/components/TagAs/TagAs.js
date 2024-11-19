import { loadComponent, tagOnStorage, updateUI } from "../../utils.js";

export class TagAs {
  static async getElement(hexColor, label, chatId) {
    const componentElement = await loadComponent("TagAs");

    // Set the color and label
    componentElement.querySelector("circle").setAttribute("fill", hexColor);
    componentElement.appendChild(document.createTextNode(label));

    // Add click event listener
    componentElement.addEventListener("click", () => {
      tagOnStorage(chatId, label);
      updateUI();
    });

    return componentElement;
  }
}
