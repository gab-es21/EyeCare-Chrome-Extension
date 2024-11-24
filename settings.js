document.addEventListener("DOMContentLoaded", () => {
    // Functionality toggle
  const functionalityToggle = document.getElementById("functionalityToggle");
  const allSettings = document.getElementById("allSettings");

  // Load initial functionality state
  chrome.storage.sync.get("extensionEnabled", ({ extensionEnabled }) => {
    functionalityToggle.checked = extensionEnabled !== false; // Default to true
    allSettings.style.display = extensionEnabled !== false ? "block" : "none";
  });

  // Toggle functionality state
  functionalityToggle.addEventListener("change", () => {
    const isEnabled = functionalityToggle.checked;
    allSettings.style.display = isEnabled ? "block" : "none";
    chrome.storage.sync.set({ extensionEnabled: isEnabled });
  });
    
    // Sound toggle
    const soundToggle = document.getElementById("soundToggle");
    const soundIcon = document.getElementById("soundIcon");
  
    // Load initial sound state
    chrome.storage.sync.get("sound", ({ sound }) => {
      soundIcon.textContent = sound ? "🔊" : "🔇"; // 🔊 for sound on, 🔇 for sound off
    });
  
    // Toggle sound state on click
    soundToggle.addEventListener("click", () => {
      chrome.storage.sync.get("sound", ({ sound }) => {
        const newSoundState = !sound;
        soundIcon.textContent = newSoundState ? "🔊" : "🔇"; // Update icon
        chrome.storage.sync.set({ sound: newSoundState }); // Save state
      });
    });
    
    // Schedule toggle
    const scheduleToggle = document.getElementById("scheduleToggle");
    const timeInputs = document.querySelector(".time-inputs");
  
    // Load settings on page load
    chrome.storage.sync.get(
      ["sound", "scheduleEnabled", "startTime", "endTime", "interval"],
      (settings) => {
        // Update sound icon based on settings
        soundIcon.textContent = settings.sound !== false ? "🔊" : "🔇";
  
        // Update schedule toggle and input visibility
        scheduleToggle.checked = settings.scheduleEnabled || false;
        timeInputs.style.display = settings.scheduleEnabled ? "block" : "none";
  
        // Set start and end times
        document.getElementById("startTime").value = settings.startTime || "";
        document.getElementById("endTime").value = settings.endTime || "";
  
        // Update interval slider and display value
        const intervalSlider = document.getElementById("intervalSlider");
        const intervalValue = document.getElementById("intervalValue");
        intervalSlider.value = settings.interval || 20;
        intervalValue.textContent = settings.interval || 20;
      }
    );
  
    // Schedule checkbox toggle
    scheduleToggle.addEventListener("change", () => {
      const isEnabled = scheduleToggle.checked;
      timeInputs.style.display = isEnabled ? "block" : "none";
      chrome.storage.sync.set({ scheduleEnabled: isEnabled });
    });
  
    // Save start and end times
    document.getElementById("startTime").addEventListener("change", (e) => {
      chrome.storage.sync.set({ startTime: e.target.value });
    });
    document.getElementById("endTime").addEventListener("change", (e) => {
      chrome.storage.sync.set({ endTime: e.target.value });
    });
  
    // Interval slider
    const intervalSlider = document.getElementById("intervalSlider");
    const intervalValue = document.getElementById("intervalValue");
    intervalSlider.addEventListener("input", (e) => {
      const interval = e.target.value;
      intervalValue.textContent = interval;
      chrome.storage.sync.set({ interval: interval });
    });
  
    const animationDropdown = document.getElementById("animationDropdown");
    const gifPreview = document.getElementById("gifPreview");
    const selectedGif = document.getElementById("selectedGif");
  
    // Load saved selection or set default to random
    chrome.storage.sync.get("selectedAnimation", ({ selectedAnimation }) => {
      const gifToShow = selectedAnimation || "random";
      animationDropdown.value = gifToShow;
      updateGifPreview(gifToShow); // Show the saved GIF
    });
  
    // Save selected animation and update preview on change
    animationDropdown.addEventListener("change", () => {
      const selectedValue = animationDropdown.value;
      chrome.storage.sync.set({ selectedAnimation: selectedValue }, () => {
        console.log("Selected animation saved:", selectedValue);
      });
      updateGifPreview(selectedValue);
    });
  
    // Function to update the GIF preview
    function updateGifPreview(gifName) {
      if (gifName === "random") {
        selectedGif.style.display = "none"; // Hide the preview for random
        gifPreview.innerHTML = "<p>Random GIF will be shown during the reminder.</p>";
      } else {
        selectedGif.src = `assets/gifs/${gifName}`;
        selectedGif.alt = gifName;
        selectedGif.style.display = "block"; // Show the selected GIF
        gifPreview.innerHTML = ""; // Clear any random GIF message
        gifPreview.appendChild(selectedGif);
      }
    }
  
    // Test Popup Button
    const testPopupButton = document.getElementById("testPopupButton");
    testPopupButton.addEventListener("click", () => {
      chrome.storage.sync.get("selectedAnimation", ({ selectedAnimation }) => {
        const gifToShow =
          selectedAnimation === "random" || !selectedAnimation
            ? getRandomGif()
            : selectedAnimation;
        console.log("Triggering popup with gif:", gifToShow);
        showPopup(gifToShow);
      });
    });
  
    // Function to get a random GIF
    function getRandomGif() {
      const gifs = ["eyes_1_googlie.gif", "eyes_2_girl.gif", "eyes_3_sleepy.gif", "eyes_4_blue.gif"];
      const randomIndex = Math.floor(Math.random() * gifs.length);
      return gifs[randomIndex];
    }
  
    // Function to show the popup
    function showPopup(gifName) {
      chrome.runtime.sendMessage(
        { action: "showPopup", gifName },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error sending message:", chrome.runtime.lastError.message);
            return;
          }
          console.log("Popup triggered successfully:", response);
        }
      );
    }
  });