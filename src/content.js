// // SELECTORS
// const NavBarItemsSelector =
//   "body > div.relative.flex.h-full.w-full.overflow-hidden.transition-colors.z-0 > div.z-\\[21\\].flex-shrink-0.overflow-x-hidden.bg-token-sidebar-surface-primary.max-md\\:\\!w-0 > div > div > div > nav > div.flex.justify-between.h-\\[60px\\].items-center.md\\:h-header-height > div";

// let isFilterModalOpen = false;

// // get color-scheme style from html tag
// const THEME = window
//   .getComputedStyle(document.documentElement)
//   .getPropertyValue("color-scheme");

// const ICON_COLOR = THEME === "dark" ? "#B4B4B4" : "#5D5D5D";

// const renderFilterButton = async () => {
//   try {
//     // Get the local URL for component.html
//     const componentURL = chrome.runtime.getURL("components/FilterButton.html");

//     // Fetch the component HTML file
//     const response = await fetch(componentURL);
//     const componentHTML = await response.text();

//     // Create a container element to parse HTML string
//     const template = document.createElement("template");
//     template.innerHTML = componentHTML.trim();

//     const path = template.content.firstChild.querySelector("path");
//     path.setAttribute("fill", ICON_COLOR);

//     // Append the component to the desired location
//     const targetContainer = document.querySelector(NavBarItemsSelector);

//     template.content.firstChild.addEventListener("click", () => {
//       if (isFilterModalOpen) {
//         document.querySelector("#custom-filter-modal").remove();
//         isFilterModalOpen = false;

//         return;
//       }

//       isFilterModalOpen = true;
//       renderFilterModal();
//     });

//     targetContainer.appendChild(template.content.firstChild);
//   } catch (error) {
//     console.error("Error loading component:", error);
//   }
// };

// const renderFilterModal = async () => {
//   try {
//     // Get the local URL for component.html
//     const componentURL = chrome.runtime.getURL("components/FilterModal.html");

//     // Fetch the component HTML file
//     const response = await fetch(componentURL);
//     const componentHTML = await response.text();

//     // Create a container element to parse HTML string
//     const template = document.createElement("template");
//     template.innerHTML = componentHTML.trim();

//     // Append the component to the desired location
//     const targetContainer = document.querySelector("body");

//     const filterIconPosition = document
//       .querySelector("#custom-filter-icon")
//       .getBoundingClientRect();

//     template.content.firstChild.style.transform = `translate(${
//       filterIconPosition.x + 30
//     }px, ${filterIconPosition.y + 30}px)`;

//     targetContainer.appendChild(template.content.firstChild);
//   } catch (error) {
//     console.error("Error loading component:", error);
//   }
// };

// const getMenuParentElement = () =>
//   document.querySelector('[data-testid="share-chat-menu-item"]').parentElement;

// const listenChatMenuClicked = () => {
//   try {
//     const elements = document.querySelectorAll('[aria-haspopup="menu"]');
//     elements.forEach((element) => {
//       element.addEventListener("click", (event) => {
//         getMenuParentElement();
//       });
//     });
//   } catch (error) {
//     console.error("Error in contextMenuClicked:", error);
//   }
// };

// function main() {
//   renderFilterButton();

//   listenChatMenuClicked();
// }

// setTimeout(() => {
//   main();
// }, 1000);
