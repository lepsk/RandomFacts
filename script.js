let firstLoad = true;
let timeout;
let glowEnabled = localStorage.getItem('glowEnabled') === 'true' || localStorage.getItem('glowEnabled') === null;
let selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
let fetchedFacts = new Set();

let cooldownActive = false;
const cooldownDuration = 6.9;

let pendingAction = null;
let currentFactText = '';

function fetchFact() {
    if (cooldownActive) {
        return;
    }
    
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

    const useNewAPI = Math.random() < 0.5;
    const url = useNewAPI 
        ? 'https://uselessfacts.jsph.pl/api/v2/facts/random?language=en'
        : 'https://api.api-ninjas.com/v1/facts';

    fetch(url, {
        headers: useNewAPI ? {} : { 'X-Api-Key': 'rctsX3r2CIWwWe1aIBRvIw==EhNt3AHCgeH2z0Jn' }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        let factText;
        if (useNewAPI) {
            factText = data.text; 
        } else {
            factText = data[0]?.fact; 
        }

        if (factText) {
            if (fetchedFacts.has(factText)) {
                fetchFact(); 
            } else {
                fetchedFacts.add(factText);
                currentFactText = factText;
                if (selectedLanguage !== 'en') {
                    translateFact(currentFactText, selectedLanguage);
                } else {
                    displayFact(currentFactText, 'en');
                }
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

// Initialize cooldown message
const cooldownMessage = document.createElement('div');
cooldownMessage.id = 'cooldown-message';
document.body.appendChild(cooldownMessage);
cooldownMessage.style.display = 'none';

function startCooldown() {
    cooldownActive = true;
    let countdown = cooldownDuration;

    cooldownMessage.style.display = 'block';
    cooldownMessage.textContent = `Cooldown: ${countdown.toFixed(1)} seconds`;

    refreshButton.style.display = 'none';
    refreshLightButton.style.display = 'none';

    const countdownInterval = setInterval(() => {
        countdown -= 0.1;
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            cooldownMessage.style.display = 'none';
            cooldownActive = false;
            if (pendingAction) {
                pendingAction();
                pendingAction = null;
            }
            refreshButton.style.display = 'block';
            refreshLightButton.style.display = 'block';
        } else {
            cooldownMessage.textContent = `Cooldown: ${countdown.toFixed(1)} seconds`;
        }
    }, 100);
}

let refreshButton = document.getElementById('refresh');
let refreshLightButton = document.getElementById('refresh-light');

refreshButton.addEventListener('click', () => {
    if (cooldownActive) {
        return;
    }
    fetchFact();
    startCooldown();
});

refreshLightButton.addEventListener('click', () => {
    if (cooldownActive) {
        return;
    }
    fetchFact();
    startCooldown();
});

async function translateFact(factText, targetLang) {
    if (targetLang === 'en') {
        displayFact(factText, targetLang);
        return;
    }

    const detectUrl = 'https://deep-translate1.p.rapidapi.com/language/translate/v2/detect';
    const translateUrl = 'https://deep-translate1.p.rapidapi.com/language/translate/v2';

    const detectOptions = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': '5ffd41ebd2msheec6268037cc706p128a80jsncca3378cdb06',
            'x-rapidapi-host': 'deep-translate1.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ q: factText })
    };

    try {
        const detectResponse = await fetch(detectUrl, detectOptions);
        const detectResult = await detectResponse.json();

        if (!detectResult || !detectResult.data || !detectResult.data.detections || detectResult.data.detections.length === 0) {
            throw new Error('Language detection failed or returned no results');
        }

        const sourceLanguage = detectResult.data.detections[0].language;

        const translationData = {
            source_language: sourceLanguage,
            target_language: targetLang,
            text: factText
        };

        const translateOptions = {
            method: 'POST',
            headers: {
                'x-rapidapi-key': '5ffd41ebd2msheec6268037cc706p128a80jsncca3378cdb06',
                'x-rapidapi-host': 'deep-translate1.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                q: factText,
                source: sourceLanguage,
                target: targetLang
            })
        };

        const translateResponse = await fetch(translateUrl, translateOptions);
        const translateResult = await translateResponse.json();

        if (translateResponse.ok) {
            if (translateResult && translateResult.data && translateResult.data.translations && translateResult.data.translations.translatedText) {
                displayFact(translateResult.data.translations.translatedText, targetLang);
            } else {
                console.error('Translation error:', translateResult);
                displayFact('Translation failed. Please try again.');
            }
        } else {
            console.error('Translation failed:', translateResult.error);
            displayFact('Translation failed: ' + translateResult.error.message);
        }
    } catch (error) {
        console.error('Error translating fact:', error);
        displayFact(`An error occurred during translation: ${error.message}`, targetLang);
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

        applyGlowEffect();
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

// Load the initial theme from localStorage
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
    } else {
        // Set default theme to dark mode if no theme is saved
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark-theme');
    }
    fetchFact();
    document.getElementById('language').value = selectedLanguage;
});

// Event listeners for language selection
document.getElementById('language').addEventListener('change', function() {
    if (cooldownActive) {
        pendingAction = () => {
            selectedLanguage = this.value;
            localStorage.setItem('selectedLanguage', selectedLanguage);
            translateFact(currentFactText, selectedLanguage);
        };
        return;
    }

    selectedLanguage = this.value;
    localStorage.setItem('selectedLanguage', selectedLanguage);
    translateFact(currentFactText, selectedLanguage);
});

// Settings menu functionality
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

// Glow effect toggle
document.getElementById('toggle-glow').addEventListener('click', function() {
    glowEnabled = !glowEnabled;
    localStorage.setItem('glowEnabled', glowEnabled);
    applyGlowEffect();
});

// Theme toggle buttons in the settings menu
document.getElementById('toggle-light-theme').addEventListener('click', function() {
    document.body.classList.remove('dark-theme', 'navy-theme');
    document.body.classList.add('light-theme');
    localStorage.setItem('theme', 'light-theme');
});

document.getElementById('toggle-dark-theme').addEventListener('click', function() {
    document.body.classList.remove('light-theme', 'navy-theme');
    document.body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark-theme');
});

document.getElementById('toggle-navy-theme').addEventListener('click', function() {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add('navy-theme');
    localStorage.setItem('theme', 'navy-theme');
});
