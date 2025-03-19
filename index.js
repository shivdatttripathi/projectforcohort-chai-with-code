// const url = `https://api.freeapi.app/api/v1/public/youtube/videos?page=${2}`;

// const options = { method: "GET", headers: { accept: "application/json" } };

// const getData = async () => {
//   try {
//     const response = await fetch(url, options);

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const data = await response.json();

//     // Ensure `data.data` is always an array
//     console.log(data);
//     // Store data in localStorage
//     localStorage.setItem("videoData", JSON.stringify(data.data));

//     return data.data;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return []; // Return an empty array to avoid errors
//   }
// };

// document.addEventListener("DOMContentLoaded", async () => {
//   const cardsContainer = document.querySelector(".cards");

//   if (!cardsContainer) {
//     console.error("Error: Element with class 'cards' not found.");
//     return;
//   }

//   // Fetch data from API or localStorage
//   const data = await getData();
//   console.log(data);
//   if (data.length === 0) {
//     cardsContainer.innerHTML = "<p>No videos found.</p>";
//     return;
//   }

//   // Clear existing static cards
//   cardsContainer.innerHTML = "";

//   // Dynamically create and append new video cards\
//   console.log(data);
//   data.data.forEach((video) => {
//     const card = document.createElement("div");
//     card.classList.add("card");

//     card.innerHTML = `
//       <img src="${
//         video.items.snippet.thumbnails.high.url ||
//         "https://via.placeholder.com/200"
//       }  " width="${video.items.snippet.thumbnails.high.width || 200}"
//        " height="${video.items.snippet.thumbnails.high.height || 200}"

//       " alt="${video.title || "No Title"}" />
//       <h3>${video.items.snippet.title || "No Title"}</h3>
//       <p>${video.description || "No Description Available"}</p>
//       <button >
//       <a href="https://www.youtube.com/channel/${
//         video.items.snippet.channelId
//       }" target="_blank">Watch
//       </a>

//       </button>
//     `;

//     cardsContainer.appendChild(card);
//   });
// });

let currentPage = 1; // Track current page

const fetchVideos = async (page) => {
  const url = `https://api.freeapi.app/api/v1/public/youtube/videos?page=${page}&limit=10&query=javascript&sortBy=mostViewed`;

  const options = { method: "GET", headers: { accept: "application/json" } };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || []; // Return video array or empty array
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const updateUI = async () => {
  const cardsContainer = document.querySelector(".cards");
  const pageNumber = document.getElementById("pageNumber");
  const prevButton = document.getElementById("prevPage");
  const nextButton = document.getElementById("nextPage");

  // Clear existing content
  cardsContainer.innerHTML = "<p>Loading videos...</p>";

  // Fetch new page data
  const videos = await fetchVideos(currentPage);

  // Update page number
  pageNumber.innerText = `Page ${currentPage}`;

  // Enable/disable buttons
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = videos.length === 0;

  // If no videos, show message
  if (videos.length === 0) {
    cardsContainer.innerHTML = "<p>No videos found.</p>";
    return;
  }

  // Clear and update video list
  cardsContainer.innerHTML = "";
  console.log(videos);
  videos.data.forEach((video) => {
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

// Pagination Controls
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

// Load initial videos
document.addEventListener("DOMContentLoaded", updateUI);
