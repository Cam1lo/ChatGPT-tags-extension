import { loadComponent, updateUI } from "../../utils";
import { TAGS } from "../../const";
import state from "../../state";

export class FilterModal {
    constructor() {
        this.isFilterModalOpen = false;
        document.body.addEventListener("click", (event) => {
            if (
                !event.target.closest("#custom-filter-modal") &&
                !event.target.closest("#custom-filter-icon")
            ) {
                this.close();
            }
        });
    }

    open() {
        this.isFilterModalOpen = true;
        this.render();
    }

    close() {
        document.querySelector("#custom-filter-modal").remove();
        this.isFilterModalOpen = false;
    }

    setFilter(filter) {
        state.setActiveFilter(filter);
        updateUI();
        this.close();
    }

    async render() {
        try {
            const componentElement = await loadComponent("FilterModal");
            const targetContainer = document.querySelector("body");
            const filterIconPosition = document
                .querySelector("#custom-filter-icon")
                .getBoundingClientRect();

            componentElement.style.transform = `translate(${filterIconPosition.left}px, ${filterIconPosition.bottom}px)`;

            componentElement
                .querySelector("#filter-misc")
                .addEventListener("click", () => {
                    this.setFilter(TAGS.MISC.label);
                });

            componentElement
                .querySelector("#filter-work")
                .addEventListener("click", () => {
                    this.setFilter(TAGS.WORK.label);
                });

            componentElement
                .querySelector("#filter-personal")
                .addEventListener("click", () => {
                    this.setFilter(TAGS.PERSONAL.label);
                });

            componentElement.
                querySelector("#filter-none")
                .addEventListener("click", () => {
                    this.setFilter(null);
                });

            targetContainer.appendChild(componentElement);
        } catch (error) {
            console.error("Error loading component:", error);
        }
    }
}
