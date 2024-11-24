document.addEventListener("DOMContentLoaded", () => {
  // Fetch the selected GIF or default to random
  chrome.storage.sync.get("selectedAnimation", ({ selectedAnimation }) => {
    if (selectedAnimation === "random" || !selectedAnimation) {
      getRandomGif().then(displayGif);
    } else {
      displayGif(selectedAnimation);
    }
  });

  // Function to get a random GIF
  function getRandomGif() {
    return fetch("assets/gifs/gifs.json")
      .then((response) => response.json())
      .then((data) => {
        const randomIndex = Math.floor(Math.random() * data.gifs.length);
        return data.gifs[randomIndex].filename;
      })
      .catch((error) => {
        console.error("Failed to fetch GIFs:", error);
        return "default.gif"; // Fallback to a default GIF
      });
  }

  // Function to display the GIF
  function displayGif(gifName) {
    const gif = document.createElement("img");
    gif.src = `assets/gifs/${gifName}`;
    gif.style = `
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
      position: absolute;
    `;
    document.body.style.padding = "0";
    document.body.style.margin = "0"; // Ensure no body margin to fit GIF perfectly
    document.body.appendChild(gif);
  }
});