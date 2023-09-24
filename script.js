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

    fetch('https://api.api-ninjas.com/v1/facts?limit=1', {
        headers: {
            'X-Api-Key': 'fUPphqXU2zSe51bpbdrw1JEeQtpw9CJ6xzukpxPH'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data && data[0] && data[0].fact) {
            if (languageSelector.value !== 'en') {
                translateFact(data[0].fact, languageSelector.value); // translate the fact into the selected language
            } else {
                factContainer.style.opacity = 0;
                setTimeout(function() {
                    fact.textContent = data[0].fact;
                    factContainer.style.opacity = 1;
                }, 500);
            }
        } else {
            fact.textContent = 'Fact not found in response.';
        }
        firstLoad = false;
    })
    .catch(error => {
        console.error('Error:', error);
        fact.textContent = 'An error occurred.';
    });
}

function translateFact(fact, language) {
    const url = 'https://microsoft-translator-text.p.rapidapi.com/translate?api-version=3.0&to=' + language;
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': '5ffd41ebd2msheec6268037cc706p128a80jsncca3378cdb06',
            'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
        },
        body: JSON.stringify([
            {
                Text: fact
            }
        ])
    };

    fetch(url, options)
    .then(response => response.json())
    .then(data => {
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
        fact.textContent = 'An error occurred during translation.';
    });
}

fetchFact();
document.getElementById('refresh').addEventListener('click', fetchFact);
document.getElementById('language').addEventListener('change', fetchFact); // Add this line

// Listen for mouse movement
document.addEventListener('mousemove', function() {
    clearTimeout(timeout);
    document.body.style.backgroundColor = '#121212'; // dark grey

    timeout = setTimeout(function() {
        document.body.style.backgroundColor = '#000'; // black
    }, 1000); // change back to black after 1 second of no mouse movement
});
