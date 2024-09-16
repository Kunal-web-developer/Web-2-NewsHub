
const apiKey = 'd6bd086fd2f14e63b1c62dec6de8b810'; 
const endpoint = 'https://newsapi.org/v2/top-headlines'; // Example NewsAPI endpoint
const country = 'us'; // Country filter (optional)
const category = 'technology'; // Category filter (optional)

// Fetch news articles from the API
async function fetchNews() {
  try {
    const response = await fetch(`${endpoint}?country=${country}&category=${category}&apiKey=${apiKey}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    
    // Process and display the news articles
    displayNews(data.articles);
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

// Function to display news articles on your webpage
function displayNews(articles) {
  const newsContainer = document.getElementById('news-container');
  newsContainer.innerHTML = ''; // Clear any existing content

  articles.forEach(article => {
    const articleElement = document.createElement('div');
    articleElement.classList.add('article');

    // Add title and description
    articleElement.innerHTML = `
      <h3>${article.title}</h3>
      <p>${article.description}</p>
      <a href="${article.url}" target="_blank">Read more</a>
    `;

    newsContainer.appendChild(articleElement);
  });
}

// Call fetchNews on page load
window.onload = fetchNews;
