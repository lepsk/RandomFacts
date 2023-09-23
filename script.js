let firstLoad = true;
let timeout;

function fetchFact() {
    let factContainer = document.getElementById('fact-container');
    let fact = document.getElementById('fact');
    
    factContainer.style.opacity = 0;
    setTimeout(function() {
        fact.textContent = firstLoad ? 'Loading Your Fact...' : 'Loading Your New Fact...';
        factContainer.style.opacity = 1;
    }, 500);

    fetch('https://api.api-ninjas.com/v1/facts?limit=1', {
        headers: {
            'X-Api-Key': 'ziOppkPTJsYAZbIDohqy4zWDjNEbsLa2mzUslGth'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data && data[0] && data[0].fact) {
            factContainer.style.opacity = 0;
            setTimeout(function() {
                fact.textContent = data[0].fact;
                factContainer.style.opacity = 1;
            }, 500);
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

fetchFact();
document.getElementById('refresh').addEventListener('click', fetchFact);

// Listen for mouse movement
document.addEventListener('mousemove', function() {
    clearTimeout(timeout);
    document.body.style.backgroundColor = '#121212'; // dark grey

    timeout = setTimeout(function() {
        document.body.style.backgroundColor = '#000'; // black
    }, 1000); // change back to black after 1 second of no mouse movement
});
