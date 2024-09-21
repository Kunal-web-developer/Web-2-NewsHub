const API_KEY = "230cedc991094093b32c93ddd88a11aa";
const url = "https://newsapi.org/v2/everything?q=";

// Load default news (India) on page load
window.addEventListener("load", () => fetchNews("India"));

// Reload function to refresh the page
function reload() {
    window.location.reload();
}

// Fetch news articles from the News API
async function fetchNews(query) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    bindData(data.articles);
}

// Bind news articles to cards
function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    // Clear the existing cards
    cardsContainer.innerHTML = "";

    // Create a card for each article
    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });

    // Apply fade-in effect
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in-visible');
        }, index * 200);  // Delay each card's appearance
    });
}

// Fill the card with article data
function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    // Populate card with article info
    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    // Format the published date
    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
    });
    newsSource.innerHTML = `${article.source.name} · ${date}`;

    // Open the article in a new tab on click
    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

// Handle navigation item click to load corresponding news category
let curSelectedNav = null;

function onNavItemClick(id) {
    fetchNews(id);  // Fetch news based on selected category
    const navItem = document.getElementById(id);

    // Update the active navigation item
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");

    // Update the title heading dynamically
    const titleHeading = document.querySelector('.news-heading');
    titleHeading.textContent = id.charAt(0).toUpperCase() + id.slice(1) + " News"; // Update with category
}

// Search button functionality
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");
searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});

// Scroll effect for background change
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const body = document.querySelector('body');

    // Calculate a dynamic background effect based on scroll position
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = scrollPosition / maxScroll;

    // Create a dynamic background color or gradient
    const r = Math.min(255, Math.floor(scrollPercent * 255));
    const g = 200; // Static value for green
    const b = 255 - Math.min(200, Math.floor(scrollPercent * 200));

    // Update the background color or gradient
    body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    body.style.backgroundImage = `linear-gradient(to bottom, rgb(${r}, ${g}, ${b}), #fff)`;

    if (scrollPosition > 100) {
        body.classList.add('scrolled');
    } else {
        body.classList.remove('scrolled');
    }
});
