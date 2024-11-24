// Initialize the alarm to trigger the popup every 20 minutes by default
chrome.alarms.create("eyeCareReminder", { periodInMinutes: 20 });

// Listen for alarm events to display the popup
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "eyeCareReminder") {
    showPopup();
  }
});

// Function to create the popup window
function showPopup() {
  chrome.windows.create({
    url: "popup.html", // Ensure this URL is correct and accessible
    type: "popup",
    focused: true,     // Make sure the popup is focused
    width: 200,        // Width of the popup window
    height: 100        // Height of the popup window
  }, (popupWindow) => {
    console.info("Popup window created", popupWindow);

    // Close the popup after 10 seconds
    setTimeout(() => {
      if (popupWindow.id) { // Ensure the window still exists before trying to close it
        chrome.windows.remove(popupWindow.id);
      }
    }, 10000); // 10 seconds in milliseconds
  });
}

// Function to create the alarm
function setEyeCareReminder(intervalInMinutes) {
  const interval = Number(intervalInMinutes);
  if (!isNaN(interval) && interval > 0) {
    chrome.alarms.create("eyeCareReminder", {
      periodInMinutes: interval
    });
  } else {
    console.error("Invalid interval:", interval);
  }
}

// Listen for changes in the interval setting to update the alarm
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "sync") {
    if (changes.interval) {
      const newInterval = Number(changes.interval.newValue);
      console.info("Updating reminder interval to:", newInterval);
      setEyeCareReminder(newInterval);
    }
  }
});

// Load the interval from storage and set the initial alarm
chrome.storage.sync.get("interval", (result) => {
  const interval = Number(result.interval) || 20; // Default to 20 minutes
  setEyeCareReminder(interval);
});