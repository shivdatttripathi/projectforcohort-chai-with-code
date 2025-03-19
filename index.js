const url =
  "https://api.freeapi.app/api/v1/public/youtube/videos?page=1&limit=10&query=javascript&sortBy=mostViewed";

const options = { method: "GET", headers: { accept: "application/json" } };

const getData = async () => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Ensure `data.data` is always an array
    console.log(data);
    // Store data in localStorage
    localStorage.setItem("videoData", JSON.stringify(data.data));

    return data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return []; // Return an empty array to avoid errors
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const cardsContainer = document.querySelector(".cards");

  if (!cardsContainer) {
    console.error("Error: Element with class 'cards' not found.");
    return;
  }

  // Fetch data from API or localStorage
  const data = await getData();
  console.log(data);
  if (data.length === 0) {
    cardsContainer.innerHTML = "<p>No videos found.</p>";
    return;
  }

  // Clear existing static cards
  cardsContainer.innerHTML = "";

  // Dynamically create and append new video cards\
  console.log(data);
  data.data.forEach((video) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${
        video.items.snippet.thumbnails.high.url ||
        "https://via.placeholder.com/200"
      }  " width="${video.items.snippet.thumbnails.high.width || 200}"
       " height="${video.items.snippet.thumbnails.high.height || 200}"
 
      " alt="${video.title || "No Title"}" />
      <h3>${video.items.snippet.title || "No Title"}</h3>
      <p>${video.description || "No Description Available"}</p>
      <button >
      <a href="https://www.youtube.com/channel/${
        video.items.snippet.channelId
      }" target="_blank">Watch      
      </a>


      </button>
    `;

    cardsContainer.appendChild(card);
  });
});
