const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

// Check for saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
    updateToggleButton(savedTheme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleButton(newTheme);
});

function updateToggleButton(theme) {
    themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
}

// Smart Nutrition Search Logic
const searchBtn = document.getElementById('search-btn');
const foodInput = document.getElementById('food-input');
const searchResult = document.getElementById('search-result');
const foodName = document.getElementById('food-name');
const calories = document.getElementById('calories');
const proteins = document.getElementById('proteins');
const fats = document.getElementById('fats');
const carbs = document.getElementById('carbs');

async function searchFood() {
    const query = foodInput.value.trim();
    if (!query) return;

    searchBtn.textContent = 'Searching...';
    searchBtn.disabled = true;

    try {
        // Using Open Food Facts API (Open Source & Free)
        const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1`);
        const data = await response.json();

        if (data.products && data.products.length > 0) {
            const product = data.products[0]; // Get the first result
            const nutrients = product.nutriments;

            foodName.textContent = product.product_name || query;
            calories.textContent = Math.round(nutrients['energy-kcal_100g'] || 0);
            proteins.textContent = (nutrients.proteins_100g || 0).toFixed(1);
            fats.textContent = (nutrients.fat_100g || 0).toFixed(1);
            carbs.textContent = (nutrients.carbohydrates_100g || 0).toFixed(1);

            searchResult.style.display = 'block';
        } else {
            alert('Food not found. Try another term!');
            searchResult.style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching nutrition data:', error);
        alert('Could not connect to the database. Please try again.');
    } finally {
        searchBtn.textContent = 'Search';
        searchBtn.disabled = false;
    }
}

if (searchBtn) {
    searchBtn.addEventListener('click', searchFood);
    foodInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchFood();
    });
}

// Fade-in effect for cards as they scroll into view
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease-out';
    observer.observe(card);
});
