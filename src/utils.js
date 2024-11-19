import { TAGS } from "./const";
import state from "./state";

/**
 * Retrieves the icon color based on the current color scheme of the document.
 *
 * @returns {string} The hex color code for the icon. Returns "#B4B4B4" for dark theme and "#5D5D5D" for light theme.
 */
export const getIconColor = () => {
  const THEME = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue("color-scheme");

  return THEME === "dark" ? "#B4B4B4" : "#5D5D5D";
};

/**
 * Retrieves the parent element of the menu item with the data-testid attribute "share-chat-menu-item".
 *
 * @returns {Element|null} The parent element of the specified menu item, or null if the menu item is not found.
 */
export const getMenuParentElement = () =>
  document.querySelector('[data-testid="share-chat-menu-item"]')?.parentElement;

/**
 * Attaches a click event listener to elements with the attribute `aria-haspopup="menu"`.
 * When an element is clicked, it extracts the chat ID from the element's ancestor's href attribute
 * and invokes the provided callback function with the chat ID as an argument.
 *
 * @param {Function} callback - The function to be called with the chat ID when an element is clicked.
 */
export const chatContextOpened = async (callback) => {
  try {
    const elements = document.querySelectorAll('[aria-haspopup="menu"]');
    elements.forEach((element) => {
      element.addEventListener("click", () => {
        const chatId =
          element.parentElement.parentElement.parentElement.firstChild
            .getAttribute("href")
            .split("/")[2];
        callback(chatId);
      });
    });
  } catch (error) {
    console.error("Error in contextMenuClicked:", error);
  }
};

/**
 * Asynchronously loads an HTML component and returns its first child element.
 *
 * @param {string} componentName - The name of the component to load.
 * @returns {Promise<Element>} A promise that resolves to the first child element of the loaded component's HTML.
 */
export const loadComponent = async (componentName) => {
  // Get the local URL for component.html
  const componentURL = chrome.runtime.getURL(
    `./src/components/${componentName}/${componentName}.html`
  );

  // Fetch the component HTML file
  const response = await fetch(componentURL);
  const componentHTML = await response.text();

  // Create a container element to parse HTML string
  const template = document.createElement("template");
  template.innerHTML = componentHTML.trim();

  return template.content.firstChild;
};

/**
 * Retrieves tags from local storage.
 *
 * @returns {Object} The tags stored in local storage, or an empty object if none are found.
 */
export const getTagsFromStorage = () => {
  const tags = JSON.parse(localStorage.getItem("tags")) || {};
  return tags || [];
};

/**
 * Adds a label to the tags stored in localStorage for a specific chat ID.
 *
 * @param {string} chatId - The ID of the chat to tag.
 * @param {string} tag - The label to add to the chat's tags.
 * @returns {Promise<void>} A promise that resolves when the tag has been added to storage.
 */
export const tagOnStorage = async (chatId, tag) => {
  const tags = JSON.parse(localStorage.getItem("tags")) || {};

  if (!tags[chatId]) {
    tags[chatId] = tag;
  }

  tags[chatId] = tag;
  localStorage.setItem("tags", JSON.stringify(tags));
};

export const updateUI = async () => {
  const activeFilter = state.getActiveFilter();

  const elements = document.querySelectorAll("li > div > a");

  const tags = await getTagsFromStorage();

  elements.forEach((element) => {
    const chatId = element.getAttribute("href").split("/")[2];
    const chatTag = tags[chatId];

    if (chatTag) {
      // Create the div element
      const div = document.createElement("div");
      div.style.width = "3px"; // Equivalent to stroke width
      div.style.height = "100%"; // Matches the SVG's height
      div.style.position = "absolute";
      div.style.top = "0";
      div.style.left = "0";
      div.style.backgroundColor = TAGS[String(chatTag).toUpperCase()].color; // Same as stroke color

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
