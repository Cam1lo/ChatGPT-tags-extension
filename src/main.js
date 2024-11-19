import { FilterButton } from "./components/FilterButton/FilterButton.js";
import { FilterModal } from "./components/FilterModal/FilterModal.js";
import { chatContextOpened, getMenuParentElement, updateUI } from "./utils.js";
import { TagAs } from "./components/TagAs/TagAs.js";
import { TAGS } from "./const.js";

async function main() {
    // Update the UI with the tags on initial load
    updateUI();

    // Renders Filter Button component
    const filterBtn = new FilterButton();
    const filterModal = new FilterModal();

    await filterBtn.render();

    // Add click event listener to the filter button
    filterBtn.addOnClick(() => {
        if (filterModal.isFilterModalOpen) {
            filterModal.close();
        } else {
            filterModal.open();
        }
    });

    // Listen to chat modal opened
    chatContextOpened(async (chatId) => {
        const menuEl = getMenuParentElement();

        if (menuEl) {
            for (const key in TAGS) {
                const tag = TAGS[key];
                const tagElement = await TagAs.getElement(
                    tag.color,
                    tag.label,
                    chatId
                );
                menuEl.insertBefore(tagElement, menuEl.firstChild);
            }
        }
    });
}

setTimeout(main, 1000);
