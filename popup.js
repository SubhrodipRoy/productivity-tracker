document.addEventListener("DOMContentLoaded", function () {
    // Get the current tab's URL and time spent from storage
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTab = tabs[0];
      const tabId = currentTab.id;
  
      // Get the stored time for the active tab
      chrome.storage.local.get([tabId], function (result) {
        const timeSpent = result[tabId] || 0;
        document.getElementById("website-name").textContent = currentTab.url;
        document.getElementById("time-spent").textContent = `${timeSpent} minutes`;
      });
    });
  
    // Reset button to clear stored time for the active tab
    document.getElementById("reset-btn").addEventListener("click", function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTab = tabs[0];
        const tabId = currentTab.id;
  
        chrome.storage.local.remove([tabId], function () {
          document.getElementById("time-spent").textContent = "0 minutes";
        });
      });
    });
  });
  