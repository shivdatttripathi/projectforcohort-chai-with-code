let currentPage = 1;
let allVideos = []; // Store all videos for filtering

const fetchVideos = async (page) => {
  // i check api total pages 10 if any one try to greater than 10 automatically restart page 1 for safe access
  if (page > 10) {
    page = 1;
  }
  const url = `https://api.freeapi.app/api/v1/public/youtube/videos?page=${page}&limit=10&query=javascript&sortBy=mostViewed`;
  const options = { method: "GET", headers: { accept: "application/json" } };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    localStorage.setItem("videoData", JSON.stringify(data.data));
    const videoData = JSON.parse(localStorage.getItem("videoData"));

    return videoData || [];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const updateUI = async (searchQuery = "") => {
  const cardsContainer = document.querySelector(".cards");
  const pageNumber = document.getElementById("pageNumber");
  const prevButton = document.getElementById("prevPage");
  const nextButton = document.getElementById("nextPage");

  // Clear existing content
  cardsContainer.innerHTML = "<p>Loading videos...</p>";

  // Fetch new page data if not already loaded
  if (allVideos.length === 0 || searchQuery === "") {
    allVideos = await fetchVideos(currentPage);
  }

  // Filter videos based on search query
  const filteredVideos = allVideos.data.filter((video) =>
    video.items.snippet.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update page number
  if (currentPage > 10) {
    currentPage = 1;
  }
  pageNumber.innerText = `Page ${currentPage}`;

  // Enable/disable buttons
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = filteredVideos.length === 0;

  // If no videos, show message
  if (filteredVideos.length === 0) {
    cardsContainer.innerHTML = "<p>No videos found.</p>";
    return;
  }

  // Clear and update video list
  cardsContainer.innerHTML = "";
  filteredVideos.forEach((video) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${
        video.items.snippet.thumbnails.high.url ||
        "https://via.placeholder.com/200"
      }" 
      width="${video.items.snippet.thumbnails.high.width || 200}" 
      height="${video.items.snippet.thumbnails.high.height || 200}"
      alt="${video.items.snippet.title || "No Title"}" />

      <h3>${video.items.snippet.title || "No Title"}</h3>
      <p>${"" || "No Description Available"}</p>
      
      <button>
        <a href="https://www.youtube.com/channel/${
          video.items.snippet.channelId
        }" target="_blank">Visit Channel</a>
      </button>
    `;

    cardsContainer.appendChild(card);
  });
};

// Pagination for next and previous some errors face
document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    updateUI();
  }
});

document.getElementById("nextPage").addEventListener("click", () => {
  currentPage++;
  updateUI();
});

// Search
document.getElementById("searchButton").addEventListener("click", () => {
  const searchQuery = document.getElementById("searchInput").value.trim();
  updateUI(searchQuery);
});

// Load
document.addEventListener("DOMContentLoaded", () => updateUI());
