// Function to load bookmarks from localStorage on page load
window.addEventListener("load", loadBookmarks);

// Load bookmarks from localStorage
function loadBookmarks() {
  const bookmarksContainer = document.getElementById("bookmarks-container");
  const template = document.getElementById("template-bookmark-card");

  // Get bookmarks from localStorage
  let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

  // Check if there are any bookmarks
  if (bookmarks.length === 0) {
    bookmarksContainer.innerHTML =
      "<p>No bookmarks found. Go to the home page and bookmark your favorite articles.</p>";
    return;
  }

  // Render bookmarks
  bookmarks.forEach((bookmark) => {
    const cardClone = template.content.cloneNode(true);
    fillBookmarkData(cardClone, bookmark);
    bookmarksContainer.appendChild(cardClone);
  });
}

// Function to fill the bookmark data into the template
function fillBookmarkData(cardClone, bookmark) {
  const newsImg = cardClone.querySelector(".bookmark-img");
  const newsTitle = cardClone.querySelector(".bookmark-title");
  const newsSource = cardClone.querySelector(".bookmark-source");
  const newsDesc = cardClone.querySelector(".bookmark-desc");
  const removeButton = cardClone.querySelector(".remove-bookmark-button");

  // Populate the card with bookmark details
  newsImg.src =
    bookmark.image || "https://via.placeholder.com/400x200?text=No+Image";
  newsTitle.textContent = bookmark.title;
  newsDesc.textContent = bookmark.desc;
  newsSource.textContent = bookmark.source;

  // Open news source URL in a new tab
  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(bookmark.url, "_blank"); // Ensure this opens the correct URL
  });

  // Remove bookmark event
  removeButton.addEventListener("click", () => {
    removeBookmark(bookmark.title);
  });
}

// Function to remove bookmark from localStorage
function removeBookmark(title) {
  // Get bookmarks from localStorage
  let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

  // Filter out the bookmark with the given title
  bookmarks = bookmarks.filter((bookmark) => bookmark.title !== title);

  // Update localStorage
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

  // Reload the page to update the UI
  alert("Bookmark removed!"); // Feedback for user
  window.location.reload();
}

// Fetch news articles based on query
async function fetchNews(query) {
  try {
    const res = await fetch(`${newsUrl}${query}&apiKey=${API_KEY}`);
    if (!res.ok)
      throw new Error(`Network response was not ok: ${res.statusText}`);

    const data = await res.json();

    // Check if there are articles in the response
    if (data.articles && data.articles.length === 0) {
      document.getElementById("cards-container").innerHTML =
        "<p>No articles found.</p>";
    } else {
      bindData(data.articles); // Populate the articles into the UI
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    document.getElementById("cards-container").innerHTML =
      "<p>Error loading news. Please try again later.</p>";
  }
}
