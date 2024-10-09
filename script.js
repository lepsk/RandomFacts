let firstLoad = true;
let timeout;

function fetchFact() {
    let factContainer = document.getElementById('fact-container');
    let fact = document.getElementById('fact');
    let languageSelector = document.getElementById('language');
    
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
document.getElementById('language').addEventListener('change', fetchFact);

document.addEventListener('mousemove', function() {
    clearTimeout(timeout);
    document.body.style.backgroundColor = '#121212'; // dark grey

    timeout = setTimeout(function() {
        document.body.style.backgroundColor = '#000'; // black
    }, 1000); // change back to black after 1 second of no mouse movement
});
