document.addEventListener("DOMContentLoaded", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        const currentTab = tabs[0];
        const tabId = currentTab.id;
  
        const baseUrl = new URL(currentTab.url).origin;
  
        let startTime = Date.now(); // Start time when the popup opens
        let timerInterval = null;
  
        // Function to update the timer display in HH:MM:SS format
        function updateTimer() {
          const elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Time in seconds
          const hours = Math.floor(elapsedTime / 3600); // Hours
          const minutes = Math.floor((elapsedTime % 3600) / 60); // Minutes
          const seconds = elapsedTime % 60; // Seconds
  
          // Format time as HH:MM:SS
          const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          document.getElementById("time-spent").textContent = formattedTime;
        }
  
        // Start updating the timer every second
        timerInterval = setInterval(updateTimer, 1000);
  
        // Set initial website name
        document.getElementById("website-name").textContent = baseUrl;
  
        // Reset button to clear stored time for the active tab
        document.getElementById("reset-btn").addEventListener("click", function () {
          startTime = Date.now(); // Reset the start time
          document.getElementById("time-spent").textContent = "00:00:00"; // Reset the displayed time
        });
      }
    });
  });
  