const API_KEY = "230cedc991094093b32c93ddd88a11aa";
const newsUrl = "https://newsapi.org/v2/everything?q=";
const apiKey = "76413debf4821b83236e6563d577dec9";
const weatherApiUrl =
  "https://api.weatherstack.com/current?access_key=" + apiKey + "&query=";
const articlesPerPage = 15; // Set the number of articles per page to 15
let allArticles = []; // Store all articles fetched
let currentPage = 1; // Track current page

// Load user preferences and fetch news on page load
window.onload = async () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("You are not logged in! Please create an account.");
    window.location.href = "login.html";
    return;
  }

  document.getElementById(
    "userPreferences"
  ).innerHTML = `Hello, ${currentUser.name}!`;

  const preferences = JSON.parse(localStorage.getItem("userPreferences"));
  if (preferences) {
    await fetchNews(preferences.topics.join(", ")); // Fetch news based on topics
  } else {
    document.getElementById("userPreferences").innerHTML +=
      "<br>You have not set any preferences yet.";
  }

  fetchWeather("India");
};

// Fetch news articles based on query
async function fetchNews(query) {
  currentPage = 1; // Reset to the first page
  const res = await fetch(`${newsUrl}${query}&apiKey=${API_KEY}`);
  const data = await res.json();
  allArticles = data.articles || []; // Store all articles fetched
  renderPagination(); // Render pagination controls
  bindData(); // Render articles for the first page
}

// Function to bind news data to cards
function bindData() {
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = allArticles.slice(startIndex, endIndex);

  const cardsContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");

  cardsContainer.innerHTML = ""; // Clear previous articles

  currentArticles.forEach((article) => {
    if (!article.urlToImage) return;
    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

// Function to handle pagination click events
function handlePageClick(pageNumber) {
  currentPage = pageNumber;
  bindData(); // Update the article list to reflect the current page
  renderPagination(); // Re-render pagination controls
}

// Function to render pagination controls
function renderPagination() {
  const totalPages = Math.ceil(allArticles.length / articlesPerPage);
  const paginationElement = document.getElementById("pagination");

  paginationElement.innerHTML = ""; // Clear previous pagination

  // Create Previous Button
  if (currentPage > 1) {
    const prevButton = document.createElement("button");
    prevButton.innerText = "Previous";
    prevButton.onclick = () => handlePageClick(currentPage - 1);
    paginationElement.appendChild(prevButton);
  }

  // Create buttons for page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.innerText = i;
    pageButton.className = i === currentPage ? "active" : "";
    pageButton.onclick = () => handlePageClick(i);
    paginationElement.appendChild(pageButton);
  }

  // Create Next Button
  if (currentPage < totalPages) {
    const nextButton = document.createElement("button");
    nextButton.innerText = "Next";
    nextButton.onclick = () => handlePageClick(currentPage + 1);
    paginationElement.appendChild(nextButton);
  }
}

// Function to fill article data in the card
function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDesc = cardClone.querySelector("#news-desc");

  newsImg.src = article.urlToImage;
  newsTitle.innerHTML = article.title;
  newsDesc.innerHTML = article.description;

  const anchor = document.createElement("a");
  anchor.href = article.url;
  anchor.target = "_blank";
  anchor.textContent = "Read more";
  anchor.style.display = "none";
  anchor.classList.add("read-more-link");
  newsDesc.appendChild(anchor);

  const date = new Date(article.publishedAt).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });
  newsSource.innerHTML = `${article.source.name} · ${date}`;

  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.url, "_blank");
  });
}

// Fetch and display news when search bar is used
document
  .getElementById("search-text")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const query = this.value;
      fetchNews(query);
      this.value = ""; // Clear input after search
    }
  });

// Handle country selection for weather

document
  .getElementById("country-select")
  .addEventListener("change", function () {
    const selectedCountry = this.value;
    fetchWeather(selectedCountry);
  });

// Fetch weather data
async function fetchWeather(city) {
  try {
    const res = await fetch(`${weatherApiUrl}${city}`);
    const data = await res.json();
    console.log(data); // Log the data to debug if needed

    // Check if the API returned a valid response
    if (!data || !data.current) {
      document.getElementById("weather-info").innerHTML =
        "Weather data not available.";
      return;
    }

    // Extract necessary information
    const weatherIcon = data.current.weather_icons
      ? data.current.weather_icons[0]
      : "";
    const temperature = data.current.temperature || "N/A";
    const location = `${data.location.country}, ${data.location.name}`;

    // Update DOM elements with weather data
    document.getElementById("weather-icon").src = weatherIcon;
    document.getElementById(
      "weather-info"
    ).innerHTML = `${location} ${temperature}°C`;
    document.getElementById("weather-icon").style.display = weatherIcon
      ? "inline"
      : "none";
  } catch (error) {
    console.error("Error fetching weather data:", error);
    document.getElementById("weather-info").innerHTML =
      "Error fetching weather data.";
  }
}

// Function to fetch breaking news
async function fetchBreakingNews() {
  const url = `https://newsapi.org/v2/top-headlines?q=trump&apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.articles.length > 0) {
      const headlines = data.articles
        .map((article) => article.title)
        .join(" | ");
      document.getElementById("breaking-news-marquee").textContent = headlines;
    } else {
      document.getElementById("breaking-news-marquee").textContent =
        "No breaking news available.";
    }
  } catch (error) {
    console.error("Error fetching breaking news:", error);
    document.getElementById("breaking-news-marquee").textContent =
      "Error loading news.";
  }
}

// Call fetchBreakingNews on page load
window.addEventListener("load", fetchBreakingNews);

// Function to handle navigation clicks and fetch category-specific news
function onNavItemClick(category) {
  fetchNews(category); // Fetch news based on the selected category
}

// Highlight the active nav item (optional for UI improvement)
document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", function () {
    document.querySelector(".nav-item.active")?.classList.remove("active");
    this.classList.add("active");
  });
});

// Search bar functionality
document
  .getElementById("search-text")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const query = this.value;
      fetchNews(query);
      this.value = ""; // Clear input after search
    }
  });
document.addEventListener("DOMContentLoaded", () => {
  // Get the current logged-in user and user preferences from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userPreferences = JSON.parse(localStorage.getItem("userPreferences"));

  // Check if user and preferences exist in localStorage
  if (currentUser && userPreferences) {
    const userName = currentUser.email.split("@")[0]; // Extract username from email
    const topics = userPreferences.topics.join(", "); // Join selected topics as string
    const sources = userPreferences.sources.join(", "); // Join selected sources as string

    // Update the page to display the username and preferences dynamically
    document.getElementById("userPreferences").innerHTML = `
          <h2 class="user-name">Hello, ${userName}!</h2>
          <div class="user-pref"><strong>Your Preferred Topics:</strong> ${topics}</div>
          <div class="user-pref"><strong>Your Preferred Sources:</strong> ${sources}</div>
      `;

    // Simulate fetching and displaying news based on the user's preferred topics
    displayNews(userPreferences.topics);
  } else {
    // If no preferences are found, display a message with a link to set preferences
    document.getElementById("userPreferences").innerHTML = `
          <p>No preferences set. Please <a href="preferences.html">set your preferences</a>.</p>
      `;
  }
});

// Function to display news cards based on the user's preferred topics
function displayNews(topics) {
  const newsContainer = document.getElementById("news-container");
  newsContainer.innerHTML = ""; // Clear previous news content

  // Loop through the selected topics and create mock news cards
  topics.forEach((topic) => {
    const newsCard = document.createElement("div");
    newsCard.className = "news-card"; // Add styling class to news cards
    newsCard.innerHTML = `
          <h3>${topic} News</h3>
          <p>Stay updated on the latest trends and stories in ${topic}.</p>
      `;
    // Append the created news card to the news container
    newsContainer.appendChild(newsCard);
  });
}
// Function to bookmark an article
// Function to bookmark an article
// Sample articles for demonstration
const articles = [
  {
    id: 1,
    title: "Article One",
    source: "Source A",
    date: "2024-09-26",
    description: "Description for Article One.",
    image: "https://via.placeholder.com/400x200",
  },
  {
    id: 2,
    title: "Article Two",
    source: "Source B",
    date: "2024-09-25",
    description: "Description for Article Two.",
    image: "https://via.placeholder.com/400x200",
  },
  // Add more articles as needed
];

// Function to bookmark an article
function bookmarkArticle(button) {
  const card = button.closest(".card");
  const title = card.querySelector("#news-title").innerText;
  const source = card.querySelector("#news-source").innerText;
  const description = card.querySelector("#news-desc").innerText;
  const image = card.querySelector("#news-img").src;
  const url = card.querySelector(".read-more-link").href;

  // Use the title as a unique identifier for simplicity
  const bookmark = {
    title: title,
    source: source,
    description: description,
    image: image,
    date: new Date().toLocaleDateString(),
    url: url,
  };

  // Get bookmarks from local storage or initialize an empty array
  let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

  // Check if the article is already bookmarked
  if (!bookmarks.some((b) => b.title === title)) {
    bookmarks.push(bookmark);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    alert(`${title} has been bookmarked!`);
  } else {
    alert(`${title} is already bookmarked.`);
  }
}
