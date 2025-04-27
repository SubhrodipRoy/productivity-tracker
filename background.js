let activeTab = null;
let startTime = null;
let timeSpent = 0;

// When a tab is activated (focus changed), start tracking time
chrome.tabs.onActivated.addListener((activeInfo) => {
  if (activeTab && startTime) {
    timeSpent += Math.floor((Date.now() - startTime) / 1000 / 60); // Add time in minutes
    saveData(activeTab, timeSpent);
  }
  activeTab = activeInfo.tabId;
  startTime = Date.now();
});

// When a tab is removed, save the time spent before the tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabId === activeTab && startTime) {
    timeSpent += Math.floor((Date.now() - startTime) / 1000 / 60);
    saveData(activeTab, timeSpent);
  }
});

// Save the time spent to chrome.storage.local, using the base domain (e.g., github.com)
function saveData(tabId, time) {
  chrome.tabs.get(tabId, (tab) => {
    if (tab && tab.url) {  // Ensure tab is valid and has a URL
      const baseUrl = new URL(tab.url).origin;  // Get the base domain (e.g., https://github.com)
      chrome.storage.local.set({ [baseUrl]: time });
    } else {
      console.error("Error: Tab or URL not available.");
    }
  });
}
