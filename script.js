let firstLoad = true;
let timeout;
let glowEnabled = true;

function fetchFact() {
    let factContainer = document.getElementById('fact-container');
    let fact = document.getElementById('fact');
    let languageSelector = document.getElementById('language');

    if (glowEnabled) {
        factContainer.className = ''; // Remove previous glow effect class
    }

    factContainer.style.opacity = 0;
    setTimeout(function() {
        fact.textContent = firstLoad ? 'Loading Your Fact...' : 'Loading Your New Fact...';
        factContainer.style.opacity = 1;
    }, 500);

    fetch('https://api.api-ninjas.com/v1/facts', {
        headers: {
            'X-Api-Key': 'rctsX3r2CIWwWe1aIBRvIw==EhNt3AHCgeH2z0Jn'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('API Response:', data);
        if (data && data.length > 0 && data[0].fact) {
            if (languageSelector.value !== 'en') {
                translateFact(data[0].fact, languageSelector.value);
            } else {
                factContainer.style.opacity = 0;
                setTimeout(function() {
                    fact.textContent = data[0].fact;
                    factContainer.style.opacity = 1;

                    if (glowEnabled) {
                        // Apply random glow effect with truly random colors
                        const randomColor = `hsl(${Math.random() * 360}, 100%, 75%)`;
                        factContainer.style.boxShadow = `0 0 30px 20px ${randomColor}`;
                    }
                }, 500);
            }
        } else {
            fact.textContent = 'No fact available at the moment. Please try again.';
        }
        firstLoad = false;
    })
    .catch(error => {
        console.error('Error:', error);
        fact.textContent = `An error occurred: ${error.message}`;
    });
}

function translateFact(factText, language) {
    const url = `https://microsoft-translator-text.p.rapidapi.com/translate?to=${language}&api-version=3.0`;
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': '5ffd41ebd2msheec6268037cc706p128a80jsncca3378cdb06',
            'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
        },
        body: JSON.stringify([
            {
                Text: factText
            }
        ])
    };

    fetch(url, options)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Translation API Response:', data);
        let factContainer = document.getElementById('fact-container');
        let fact = document.getElementById('fact');
        if (data && data[0] && data[0].translations && data[0].translations[0].text) {
            factContainer.style.opacity = 0;
            setTimeout(function() {
                fact.textContent = data[0].translations[0].text;
                factContainer.style.opacity = 1;
                if (glowEnabled) {
                    // Apply random glow effect with truly random colors
                    const randomColor = `hsl(${Math.random() * 360}, 100%, 75%)`;
                    factContainer.style.boxShadow = `0 0 30px 20px ${randomColor}`;
                }
            }, 500);
        } else {
            throw new Error('Translation not found in response.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        fact.textContent = `An error occurred during translation: ${error.message}`;
    });
}

fetchFact();
document.getElementById('refresh').addEventListener('click', fetchFact);
document.getElementById('refresh-light').addEventListener('click', fetchFact); // Add event listener for light theme button
document.getElementById('language').addEventListener('change', fetchFact);

document.getElementById('language-btn').addEventListener('click', function() {
    document.body.classList.toggle('modal-active');
});

document.querySelector('#language-menu .close-btn').addEventListener('click', function() {
    document.body.classList.remove('modal-active');
});

document.body.addEventListener('click', function(event) {
    if (event.target === document.body && document.body.classList.contains('modal-active')) {
        document.body.classList.remove('modal-active');
    }
});

document.getElementById('toggle-glow').addEventListener('click', function() {
    glowEnabled = !glowEnabled;
    if (glowEnabled) {
        const randomColor = `hsl(${Math.random() * 360}, 100%, 75%)`;
        document.getElementById('fact-container').style.boxShadow = `0 0 30px 20px ${randomColor}`;
    } else {
        document.getElementById('fact-container').style.boxShadow = 'none';
    }
});

document.getElementById('toggle-theme').addEventListener('click', function() {
    document.body.classList.toggle('light-theme');
    document.getElementById('refresh').style.display = document.body.classList.contains('light-theme') ? 'none' : 'block';
    document.getElementById('refresh-light').style.display = document.body.classList.contains('light-theme') ? 'block' : 'none';
});
