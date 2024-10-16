let firstLoad = true;
let timeout;
let glowEnabled = localStorage.getItem('glowEnabled') === 'true' || localStorage.getItem('glowEnabled') === null; // Defaults to true if not set
let selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';

function fetchFact() {
    let factContainer = document.getElementById('fact-container');
    let fact = document.getElementById('fact');
    let languageSelector = document.getElementById('language');

    languageSelector.value = selectedLanguage;

    if (glowEnabled) {
        factContainer.className = ''; 
    }

    factContainer.style.opacity = 0;
    setTimeout(function() {
        fact.textContent = firstLoad ? 'Loading Your Fact' : 'Loading Your New Fact';
        factContainer.style.opacity = 1;
    }, 500);

    fetch('https://api.api-ninjas.com/v1/facts', {
        headers: {
            'X-Api-Key': 'rctsX3r2CIWwWe1aIBRvIw==EhNt3AHCgeH2z0Jn' //I know the API key is visible, but I don't care since it's not attached to any credit card or sensitive information. If you abuse this API key for fun or any other reason, you're likely a sad and lonely person who should consider seeking help :)
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('API Response:', data);
        if (data && data.length > 0 && data[0].fact) {
            if (languageSelector.value !== 'en') {
                translateFact(data[0].fact, languageSelector.value);
            } else {
                displayFact(data[0].fact, 'en');
            }
        } else {
            fact.textContent = 'No fact available at the moment. Please try again.';
        }
        firstLoad = false;
    })
    .catch(error => {
        console.error('Error fetching fact:', error);
        fact.textContent = `An error occurred: ${error.message}`;
    });
}

async function translateFact(factText, targetLang) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(factText)}&langpair=en|${targetLang}`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.responseData && data.responseData.translatedText) {
            displayFact(data.responseData.translatedText, targetLang);
        } else {
            throw new Error('Translation not found in response.');
        }
    } catch (error) {
        console.error('Error during translation:', error);
        document.getElementById('fact').textContent = `An error occurred during translation: ${error.message}`;
    }
}

function displayFact(factText, targetLang) {
    let factContainer = document.getElementById('fact-container');
    let fact = document.getElementById('fact');

    factContainer.style.opacity = 0;
    setTimeout(function() {
        fact.textContent = factText;
        factContainer.style.opacity = 1;

        if (targetLang === 'he') {
            fact.classList.add('rtl');
        } else {
            fact.classList.remove('rtl');
        }

        applyGlowEffect(); // Apply glow after displaying the fact
    }, 500);
}

function applyGlowEffect() {
    const factContainer = document.getElementById('fact-container');
    if (glowEnabled) {
        const randomColor = `hsl(${Math.random() * 360}, 100%, 75%)`;
        factContainer.style.boxShadow = `0 0 30px 20px ${randomColor}`;
    } else {
        factContainer.style.boxShadow = 'none';
    }
}

fetchFact(); // Fetch the first fact

document.getElementById('language').value = selectedLanguage;

document.getElementById('refresh').addEventListener('click', fetchFact);
document.getElementById('refresh-light').addEventListener('click', fetchFact);
document.getElementById('language').addEventListener('change', function() {
    selectedLanguage = this.value;
    localStorage.setItem('selectedLanguage', selectedLanguage);
    fetchFact();
});

document.getElementById('settings-btn').addEventListener('click', function() {
    document.body.classList.toggle('modal-active');
});

document.querySelector('#settings-menu .close-btn').addEventListener('click', function() {
    document.body.classList.remove('modal-active');
});

document.body.addEventListener('click', function(event) {
    if (event.target === document.body && document.body.classList.contains('modal-active')) {
        document.body.classList.remove('modal-active');
    }
});

document.getElementById('toggle-glow').addEventListener('click', function() {
    glowEnabled = !glowEnabled;
    localStorage.setItem('glowEnabled', glowEnabled);
    applyGlowEffect(); // Update the glow effect when toggled
});

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
        document.getElementById('refresh').style.display = savedTheme === 'light-theme' ? 'none' : 'block';
        document.getElementById('refresh-light').style.display = savedTheme === 'light-theme' ? 'block' : 'none';
    }
});

document.getElementById('toggle-theme').addEventListener('click', function() {
    document.body.classList.toggle('light-theme');
    const theme = document.body.classList.contains('light-theme') ? 'light-theme' : '';
    localStorage.setItem('theme', theme);
    
    document.getElementById('refresh').style.display = theme === 'light-theme' ? 'none' : 'block';
    document.getElementById('refresh-light').style.display = theme === 'light-theme' ? 'block' : 'none';
});
