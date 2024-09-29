const API_KEY = '230cedc991094093b32c93ddd88a11aa';
const newsUrl = 'https://newsapi.org/v2/everything?q=';
const apiKey = '2b237255cdb1f8852d669911556088a1';
const weatherApiUrl =
  'http://api.weatherstack.com/current?access_key=' + apiKey + '&query=';

// Function to load news on page load
window.addEventListener('load', () => {
  fetchNews('India');
  initializeCarousel();
  fetchWeather('India');
});

// Search bar functionality
document
  .getElementById('search-text')
  .addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = this.value;
      fetchNews(query);
      this.value = ''; // Clear input after search
    }
  });

// Fetch news articles based on query or category
async function fetchNews(query) {
  const res = await fetch(`${newsUrl}${query}&apiKey=${API_KEY}`);
  const data = await res.json();
  bindData(data.articles);
}

// Function to bind news data to cards
function bindData(articles) {
  const cardsContainer = document.getElementById('cards-container');
  const newsCardTemplate = document.getElementById('template-news-card');

  cardsContainer.innerHTML = '';

  articles.forEach((article) => {
    if (!article.urlToImage) return;
    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector('#news-img');
  const newsTitle = cardClone.querySelector('#news-title');
  const newsSource = cardClone.querySelector('#news-source');
  const newsDesc = cardClone.querySelector('#news-desc');

  newsImg.src = article.urlToImage;
  newsTitle.innerHTML = article.title;
  newsDesc.innerHTML = article.description;

  const date = new Date(article.publishedAt).toLocaleString('en-US', {
    timeZone: 'Asia/Jakarta',
  });
  newsSource.innerHTML = `${article.source.name} · ${date}`;

  cardClone.firstElementChild.addEventListener('click', () => {
    window.open(article.url, '_blank');
  });
}

// Handle country selection for weather
document
  .getElementById('country-select')
  .addEventListener('change', function () {
    const selectedCountry = this.value;
    fetchWeather(selectedCountry);
  });

// Fetch weather data
async function fetchWeather(city) {
  const res = await fetch(`${weatherApiUrl}${city}`);
  const data = await res.json();

  if (data.success === false) {
    document.getElementById('weather-info').innerHTML =
      'Weather data not available.';
    return;
  }

  const weatherIcon = data.current.weather_icons[0];
  const temperature = data.current.temperature;
  const location = `${data.location.country}, ${data.location.name}`;

  document.getElementById('weather-icon').src = weatherIcon;
  document.getElementById(
    'weather-info'
  ).innerHTML = `${location} ${temperature}°C`;
  document.getElementById('weather-icon').style.display = 'inline';
}

// Function to handle navigation clicks and fetch category-specific news
function onNavItemClick(category) {
  fetchNews(category); // Fetch news based on the selected category
}

// Highlight the active nav item (optional for UI improvement)
document.querySelectorAll('.nav-item').forEach((item) => {
  item.addEventListener('click', function () {
    document.querySelector('.nav-item.active')?.classList.remove('active');
    this.classList.add('active');
  });
});
// Function to fetch breaking news
async function fetchBreakingNews() {
    const apiKey = "230cedc991094093b32c93ddd88a11aa";
    const url = `https://newsapi.org/v2/top-headlines?q=trump&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.articles.length > 0) {
            const headlines = data.articles.map(article => article.title).join(' | ');
            document.getElementById("breaking-news-marquee").textContent = headlines;
        } else {
            document.getElementById("breaking-news-marquee").textContent = "No breaking news available.";
        }
    } catch (error) {
        console.error("Error fetching breaking news:", error);
        document.getElementById("breaking-news-marquee").textContent = "Error loading news.";
    }
}

// Call fetchBreakingNews on page load
window.addEventListener("load", fetchBreakingNews);

