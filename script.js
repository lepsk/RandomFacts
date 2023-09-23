// Variable to track if the page has just loaded
let firstLoad = true;

// Variable to hold the timeout
let timeout;

function fetchFact() {
    // Set the text to "Loading Your Fact..." or "Loading Your New Fact..." depending on whether the page has just loaded
    document.getElementById('fact').textContent = firstLoad ? 'Loading Your Fact...' : 'Loading Your New Fact...';

    fetch('https://api.api-ninjas.com/v1/facts?limit=1', {
        headers: {
            'X-Api-Key': 'ziOppkPTJsYAZbIDohqy4zWDjNEbsLa2mzUslGth'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data && data[0] && data[0].fact) {
            document.getElementById('fact').textContent = data[0].fact;
        } else {
            document.getElementById('fact').textContent = 'Fact not found in response.';
        }
        // After the first load, set firstLoad to false
        firstLoad = false;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('fact').textContent = 'An error occurred.';
    });
}

// Fetch a fact when the page loads
fetchFact();

// Fetch a new fact when the image is clicked
document.getElementById('refresh').addEventListener('click', fetchFact);

// Set the background color to black after 3 seconds of inactivity
function startTimeout() {
    timeout = setTimeout(function() {
        document.body.style.backgroundColor = '#000';
    }, 3000);
}

// Clear the timeout and set the background color to grey when the mouse moves
document.addEventListener('mousemove', function() {
    clearTimeout(timeout);
    document.body.style.backgroundColor = '#333';
    startTimeout();
});

// Start the timeout when the page loads
startTimeout();
