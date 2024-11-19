chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.includes("chatgpt.com")) {
    // Inject code or take other actions
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["dist/main.js"],
    });
  }
});
