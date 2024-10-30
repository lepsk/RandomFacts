let firstLoad = true;
let timeout;
let glowEnabled = localStorage.getItem('glowEnabled') === 'true' || localStorage.getItem('glowEnabled') === null;
let selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
let fetchedFacts = new Set();

let cooldownActive = false; // To track if cooldown is active
const cooldownDuration = 6.9; // Cooldown duration in seconds

let pendingAction = null; // Store the pending action during cooldown

function fetchFact() {
    if (cooldownActive) {
        return; // If cooldown is active, do nothing
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
                if (languageSelector.value !== 'en') {
                    translateFact(factText, languageSelector.value);
                } else {
                    displayFact(factText, 'en');
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

let refreshButton = document.getElementById('refresh');
let refreshLightButton = document.getElementById('refresh-light');

// Initialize cooldown message
const cooldownMessage = document.createElement('div');
cooldownMessage.id = 'cooldown-message';
document.body.appendChild(cooldownMessage); // Add to the body
cooldownMessage.style.display = 'none'; // Initially hidden

function startCooldown() {
    cooldownActive = true; // Set cooldown active
    let countdown = cooldownDuration;

    cooldownMessage.style.display = 'block'; // Show cooldown message
    cooldownMessage.textContent = `Cooldown: ${countdown.toFixed(1)} seconds`; // Set initial message

    refreshButton.style.display = 'none'; // Hide the refresh button
    refreshLightButton.style.display = 'none'; // Hide the refresh light button

    const countdownInterval = setInterval(() => {
        countdown -= 0.1; // Decrease countdown
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            cooldownMessage.style.display = 'none'; // Hide the message
            cooldownActive = false; // Reset cooldown active
            
            // Perform the pending action if exists
            if (pendingAction) {
                pendingAction(); // Execute the pending action
                pendingAction = null; // Reset pending action
            }
            refreshButton.style.display = 'block'; // Restore the refresh button
            refreshLightButton.style.display = 'block'; // Restore the refresh light button
        } else {
            cooldownMessage.textContent = `Cooldown: ${countdown.toFixed(1)} seconds`; // Update message
        }
    }, 100); // Update every 100 ms
}

// Update event listeners for both buttons to replace the button with the countdown
refreshButton.addEventListener('click', () => {
    if (cooldownActive) {
        return; // Do nothing if cooldown is active
    }
    fetchFact(); // Fetch a new fact if no cooldown
    startCooldown(); // Start cooldown after fetching a fact
});

refreshLightButton.addEventListener('click', () => {
    if (cooldownActive) {
        return; // Do nothing if cooldown is active
    }
    fetchFact(); // Fetch a new fact if no cooldown
    startCooldown(); // Start cooldown after fetching a fact
});

async function translateFact(factText, targetLang) {
    // Construct the URL for the Lingva API
    const url = `https://lingva.ml/api/v1/translate?text=${encodeURIComponent(factText)}&to=${targetLang}&from=en`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'Accept': 'application/json', // Optional, usually not needed
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        // Lingva returns the translated text in the `text` property
        if (data && data.text) {
            displayFact(data.text, targetLang);
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

fetchFact();

document.getElementById('language').value = selectedLanguage;

document.getElementById('language').addEventListener('change', function() {
    if (cooldownActive) {
        pendingAction = () => {
            selectedLanguage = this.value; // Update the selected language
            localStorage.setItem('selectedLanguage', selectedLanguage);
            fetchFact(); // Fetch a new fact after the cooldown
        };
        return; // If cooldown is active, do nothing
    }

    selectedLanguage = this.value; // Update the selected language
    localStorage.setItem('selectedLanguage', selectedLanguage);
    fetchFact(); // Fetch a new fact with the new language
    startCooldown(); // Start cooldown
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
    applyGlowEffect();
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
