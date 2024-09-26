const API_KEY = '230cedc991094093b32c93ddd88a11aa';
const url = 'https://newsapi.org/v2/everything?q=';
const searchIcon = document.querySelector('.search-icon-img');
const searchBar = document.querySelector('.search-bar');
const searchText = document.getElementById('search-text');
const content = document.querySelector('.content');
const body = document.querySelector('body');
const cardsContainer = document.getElementById('cards-container');
const paginationElement = document.getElementById('pagination');

let currentPage = 1;
const articlesPerPage = 6; // Number of articles per page
let allArticles = []; // Store all articles fetched
let curSelectedNav = null; // Selected navigation item
let currentQuery = 'India'; // Default query

// Fetch default news on page load
window.addEventListener('load', () => fetchNews(currentQuery));

// Fetch news from API based on the query
async function fetchNews(query) {
  currentQuery = query; // Update current query
  currentPage = 1; // Reset to the first page
  try {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    if (data.articles) {
      allArticles = data.articles; // Store all articles for pagination
      renderPagination();
      bindData();
    } else {
      console.error('No articles found');
    }
  } catch (error) {
    console.error('Error fetching news:', error);
  }
}

// Bind the fetched articles data to the UI for the current page
function bindData() {
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = allArticles.slice(startIndex, endIndex);

  cardsContainer.innerHTML = ''; // Clear previous content

  // If there are fewer articles than required, fill the rest with placeholders
  for (let i = 0; i < articlesPerPage; i++) {
    if (i < currentArticles.length) {
      const article = currentArticles[i];
      if (!article.urlToImage) continue; // Skip if image is not available
      const cardClone = createNewsCard(article);
      cardsContainer.appendChild(cardClone);
    } else {
      // Create an empty placeholder card
      const placeholderCard = createPlaceholderCard();
      cardsContainer.appendChild(placeholderCard);
    }
  }
}

// Create and fill a single news card
function createNewsCard(article) {
  const card = document.createElement('div');
  card.classList.add('card');

  const cardHeader = document.createElement('div');
  cardHeader.classList.add('card-header');

  const img = document.createElement('img');
  img.src = article.urlToImage;
  img.alt = 'news-image';
  cardHeader.appendChild(img);

  const cardContent = document.createElement('div');
  cardContent.classList.add('card-content');

  const newsTitle = document.createElement('h3');
  newsTitle.textContent = article.title;
  cardContent.appendChild(newsTitle);

  const newsSource = document.createElement('h6');
  newsSource.classList.add('news-source');
  const date = new Date(article.publishedAt).toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata',
  });
  newsSource.textContent = `${article.source.name} · ${date}`;
  cardContent.appendChild(newsSource);

  const newsDesc = document.createElement('p');
  newsDesc.classList.add('news-desc');
  newsDesc.textContent = article.description;
  cardContent.appendChild(newsDesc);

  // Add click event to open the news link
  card.addEventListener('click', () => {
    window.open(article.url, '_blank');
  });

  card.appendChild(cardHeader);
  card.appendChild(cardContent);
  return card;
}

// Create an empty placeholder card for missing articles
function createPlaceholderCard() {
  const card = document.createElement('div');
  card.classList.add('card', 'placeholder');

  const placeholderContent = document.createElement('div');
  placeholderContent.classList.add('placeholder-content');
  placeholderContent.textContent = 'No article available'; // Placeholder text

  card.appendChild(placeholderContent);
  return card;
}

// Render pagination
function renderPagination() {
  paginationElement.innerHTML = '';
  const totalPages = Math.ceil(allArticles.length / articlesPerPage);

  // Previous button
  if (currentPage > 1) {
    const prevPage = document.createElement('button');
    prevPage.textContent = 'Previous';
    prevPage.onclick = () => changePage(currentPage - 1);
    paginationElement.appendChild(prevPage);
  }

  // Page numbers display
  const pageNumbersElement = document.createElement('span');
  pageNumbersElement.textContent = `Page ${currentPage} of ${totalPages}`;
  paginationElement.appendChild(pageNumbersElement);

  // Next button
  if (currentPage < totalPages) {
    const nextPage = document.createElement('button');
    nextPage.textContent = 'Next';
    nextPage.onclick = () => changePage(currentPage + 1);
    paginationElement.appendChild(nextPage);
  }
}

// Change page
function changePage(page) {
  currentPage = page;
  bindData();
  renderPagination();
}

function onNavItemClick(id) {
  fetchNews(id);
  const navItem = document.getElementById(id);
  if (curSelectedNav) curSelectedNav.classList.remove('active'); // Remove "active" from previous
  curSelectedNav = navItem;
  curSelectedNav.classList.add('active');
}

// Search bar functionality: Toggle and perform search
searchIcon.addEventListener('click', toggleSearchBar);

function toggleSearchBar() {
  if (searchBar.style.display === 'flex') {
    searchBar.style.display = 'none';
    body.classList.remove('blurred');
  } else {
    searchBar.style.display = 'flex';
    searchBar.style.position = 'fixed';
    searchBar.style.top = '30%';
    searchBar.style.left = '50%';
    searchBar.style.transform = 'translate(-50%, -50%)';
    searchBar.style.zIndex = '1000';
    searchText.focus();
    body.classList.add('blurred');
  }
}

// Search functionality
const searchButton = document.getElementById('search-button');

searchButton.addEventListener('click', performSearch);
searchText.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') performSearch();
});

function performSearch() {
  const query = searchText.value.trim(); // Trim any whitespace
  if (!query) return;
  fetchNews(query); // Fetch news based on the search query
  toggleSearchBar(); // Hide the search bar after search
}

// Subscribe functionality
document.getElementById('subscribe-button').addEventListener('click', () => {
  const email = document.getElementById('email-input').value.trim();
  if (validateEmail(email)) {
    alert(`Subscribed with ${email}`);
    document.getElementById('email-input').value = ''; // Clear input after subscribe
  } else {
    alert('Please enter a valid email.');
  }
});

// Helper function to validate email
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Function to toggle between dark mode and light mode
function toggleMode() {
  const body = document.body;
  const modeIcon = document.getElementById('mode-toggle-icon');

  // Toggle dark-mode class on body
  body.classList.toggle('dark-mode');

  // Check if dark mode is enabled
  if (body.classList.contains('dark-mode')) {
    modeIcon.src = 'assist/dark mode.png'; // Set dark mode icon
  } else {
    modeIcon.src = 'assist/light mode.png'; // Set light mode icon
  }
}

function scrollToFooter() {
  document.querySelector('.footer').scrollIntoView({ behavior: 'smooth' });
}

// Add event listener for dark mode toggle button
document
  .getElementById('mode-toggle-button')
  .addEventListener('click', toggleMode);

