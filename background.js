let activeDomain = null;
let startTime = null;
let accumulatedTime = 0;
let storageInterval = null;

// Function to extract the base domain
function getBaseUrl(url) {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.origin; // Get base URL (e.g., https://example.com)
    } catch (error) {
        return null;
    }
}

// When a tab is activated (focus changed), start tracking time
chrome.tabs.onActivated.addListener((activeInfo) => {
    const tabId = activeInfo.tabId;

    // Fetch the URL for the active tab and track time
    chrome.tabs.get(tabId, (tab) => {
        if (tab && tab.url) {
            const domain = getBaseUrl(tab.url);
            if (domain && domain !== activeDomain) {
                // Domain switched, start the timer for the new domain
                startTimer(domain);
            }
        }
    });
});

// When a tab is updated (URL changes inside the same tab)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.active && changeInfo.url) {
        const domain = getBaseUrl(changeInfo.url);
        if (domain && domain !== activeDomain) {
            // New domain accessed, start timer for it
            startTimer(domain);
        }
    }
});

// Start the timer for the new domain
function startTimer(domain) {
    // If we're already tracking a domain, save the accumulated time for the previous one
    if (activeDomain && startTime) {
        saveTime(activeDomain);
    }

    activeDomain = domain;
    startTime = Date.now(); // Start a fresh timer for the new domain
    accumulatedTime = 0; // Reset accumulated time for the new domain

    // Set up an alarm to save time every minute
    chrome.alarms.create('timeTracker', { periodInMinutes: 1 });

    console.log(`Timer started for domain: ${domain}`);
}

// Save time spent on the domain to local storage
function saveTime(domain) {
    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - startTime + accumulatedTime) / 1000 / 60); // Convert to minutes

    console.log(`Elapsed Time for ${domain}: ${elapsedTime} minutes`);

    chrome.storage.local.get([domain], (result) => {
        const previousTime = result[domain] || 0;
        const newTime = previousTime + elapsedTime;

        // Save the new time to storage
        chrome.storage.local.set({ [domain]: newTime });

        console.log(`Saved time for ${domain}: ${newTime} minutes`);

        // Update accumulated time for the next interval
        accumulatedTime = elapsedTime;
        startTime = currentTime; // Reset the start time to current time for the next interval
    });
}

// Handle alarm trigger to save time
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'timeTracker') {
        // Save time every minute
        if (activeDomain) {
            saveTime(activeDomain);
        }
    }
});

// Optional: when Chrome is closed or unloaded, stop the timer
chrome.runtime.onSuspend.addListener(() => {
    if (activeDomain && startTime) {
        saveTime(activeDomain); // Save time when closing
    }
});
