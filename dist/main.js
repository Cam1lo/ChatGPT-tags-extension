(() => {
  // src/const.js
  var TAGS = {
    MISC: {
      label: "Misc",
      color: "#5896FF"
    },
    PERSONAL: {
      label: "Personal",
      color: "#FFCF20"
    },
    WORK: {
      label: "Work",
      color: "#FF6C5F"
    }
  };

  // src/state.js
  var ActiveFilterState = class _ActiveFilterState {
    constructor() {
      if (!_ActiveFilterState.instance) {
        this.activeFilter = null;
        _ActiveFilterState.instance = this;
      }
      return _ActiveFilterState.instance;
    }
    setActiveFilter(filter) {
      this.activeFilter = filter;
    }
    getActiveFilter() {
      return this.activeFilter;
    }
    clearActiveFilter() {
      this.activeFilter = null;
    }
  };
  var state = new ActiveFilterState();
  var state_default = state;

  // src/utils.js
  var getIconColor = () => {
    const THEME = window.getComputedStyle(document.documentElement).getPropertyValue("color-scheme");
    return THEME === "dark" ? "#B4B4B4" : "#5D5D5D";
  };
  var getMenuParentElement = () => document.querySelector('[data-testid="share-chat-menu-item"]')?.parentElement;
  var chatContextOpened = async (callback) => {
    try {
      const elements = document.querySelectorAll('[aria-haspopup="menu"]');
      elements.forEach((element) => {
        element.addEventListener("click", () => {
          const chatId = element.parentElement.parentElement.parentElement.firstChild.getAttribute("href").split("/")[2];
          callback(chatId);
        });
      });
    } catch (error) {
      console.error("Error in contextMenuClicked:", error);
    }
  };
  var loadComponent = async (componentName) => {
    const componentURL = chrome.runtime.getURL(
      `./src/components/${componentName}/${componentName}.html`
    );
    const response = await fetch(componentURL);
    const componentHTML = await response.text();
    const template = document.createElement("template");
    template.innerHTML = componentHTML.trim();
    return template.content.firstChild;
  };
  var getTagsFromStorage = () => {
    const tags = JSON.parse(localStorage.getItem("tags")) || {};
    return tags || [];
  };
  var tagOnStorage = async (chatId, tag) => {
    const tags = JSON.parse(localStorage.getItem("tags")) || {};
    if (!tags[chatId]) {
      tags[chatId] = tag;
    }
    tags[chatId] = tag;
    localStorage.setItem("tags", JSON.stringify(tags));
  };
  var updateUI = async () => {
    const activeFilter = state_default.getActiveFilter();
    const elements = document.querySelectorAll("li > div > a");
    const tags = await getTagsFromStorage();
    elements.forEach((element) => {
      const chatId = element.getAttribute("href").split("/")[2];
      const chatTag = tags[chatId];
      if (chatTag) {
        const div = document.createElement("div");
        div.style.width = "3px";
        div.style.height = "100%";
        div.style.position = "absolute";
        div.style.top = "0";
        div.style.left = "0";
        div.style.backgroundColor = TAGS[String(chatTag).toUpperCase()].color;
        element.parentElement.insertBefore(div, element.parentElement.firstChild);
      }
      if (activeFilter && chatTag !== activeFilter) {
        element.parentElement.style.display = "none";
      }
      if (activeFilter && chatTag === activeFilter) {
        element.parentElement.style.display = "block";
      }
      if (!activeFilter) {
        element.parentElement.style.display = "block";
      }
    });
  };

  // src/selectors.js
  var NavBarItemsSelector = "body > div.relative.flex.h-full.w-full.overflow-hidden.transition-colors.z-0 > div.z-\\[21\\].flex-shrink-0.overflow-x-hidden.bg-token-sidebar-surface-primary.max-md\\:\\!w-0 > div > div > div > nav > div.flex.justify-between.h-\\[60px\\].items-center.md\\:h-header-height > div";

  // src/components/FilterButton/FilterButton.js
  var FilterButton = class {
    componentElement = null;
    async render() {
      const componentElement = await loadComponent("FilterButton");
      const path = componentElement.querySelector("path");
      path.setAttribute("fill", getIconColor());
      const targetContainer = document.querySelector(NavBarItemsSelector);
      targetContainer.appendChild(componentElement);
      this.componentElement = componentElement;
    }
    addOnClick(callback) {
      this.componentElement.addEventListener("click", callback);
    }
  };

  // src/components/FilterModal/FilterModal.js
  var FilterModal = class {
    constructor() {
      this.isFilterModalOpen = false;
      document.body.addEventListener("click", (event) => {
        if (!event.target.closest("#custom-filter-modal") && !event.target.closest("#custom-filter-icon")) {
          this.close();
        }
      });
    }
    open() {
      this.isFilterModalOpen = true;
      this.render();
    }
    close() {
      document.querySelector("#custom-filter-modal")?.remove();
      this.isFilterModalOpen = false;
    }
    setFilter(filter) {
      state_default.setActiveFilter(filter);
      updateUI();
      this.close();
    }
    async render() {
      try {
        const componentElement = await loadComponent("FilterModal");
        const targetContainer = document.querySelector("body");
        const filterIconPosition = document.querySelector("#custom-filter-icon").getBoundingClientRect();
        componentElement.style.transform = `translate(${filterIconPosition.left}px, ${filterIconPosition.bottom}px)`;
        componentElement.querySelectorAll("#filter-none-icon > line").forEach((line) => {
          line.setAttribute("stroke", getIconColor());
        });
        componentElement.querySelector("#filter-misc").addEventListener("click", () => {
          this.setFilter(TAGS.MISC.label);
        });
        componentElement.querySelector("#filter-work").addEventListener("click", () => {
          this.setFilter(TAGS.WORK.label);
        });
        componentElement.querySelector("#filter-personal").addEventListener("click", () => {
          this.setFilter(TAGS.PERSONAL.label);
        });
        componentElement.querySelector("#filter-none").addEventListener("click", () => {
          this.setFilter(null);
        });
        targetContainer.appendChild(componentElement);
      } catch (error) {
        console.error("Error loading component:", error);
      }
    }
  };

  // src/components/TagAs/TagAs.js
  var TagAs = class {
    static async getElement(hexColor, label, chatId) {
      const componentElement = await loadComponent("TagAs");
      componentElement.querySelector("circle").setAttribute("fill", hexColor);
      componentElement.appendChild(document.createTextNode(label));
      componentElement.addEventListener("click", () => {
        tagOnStorage(chatId, label);
        updateUI();
      });
      return componentElement;
    }
  };

  // src/main.js
  async function main() {
    updateUI();
    const filterBtn = new FilterButton();
    const filterModal = new FilterModal();
    await filterBtn.render();
    filterBtn.addOnClick(() => {
      if (filterModal.isFilterModalOpen) {
        filterModal.close();
      } else {
        filterModal.open();
      }
    });
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
  setTimeout(main, 1e3);
})();
