function updatePopup() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const activeTab = tabs[0];
        const domain = getBaseUrl(activeTab.url);

        if (!domain) return;

        const faviconUrl = `${domain}/favicon.ico`;
        document.getElementById('favicon').src = faviconUrl;

        chrome.storage.local.get([domain], (result) => {
            const timeSpent = result[domain] || 0;
            const formattedTime = formatTime(timeSpent);
            document.getElementById('timeSpent').textContent = ` ${formattedTime}`;
        });
    });
}

// Function to extract the base domain (e.g., "https://example.com")
function getBaseUrl(url) {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.origin;
    } catch (error) {
        console.error('Invalid URL:', url);
        return null;
    }
}

// Format time nicely
function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} hr ${mins} min`;
}

// First update immediately
updatePopup();

// Update every 5 seconds
setInterval(updatePopup, 5000);
