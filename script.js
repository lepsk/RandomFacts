html {
    background-color: #000;
}

body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    font-family: 'Minimal', sans-serif;
    background-color: #121212; /* 25% darker grey background */
    margin: 0;
    padding: 0;
    position: relative;
    transition: background-color 0.5s ease;
}

#fact-container {
    font-size: 24px;
    text-align: center;
    padding: 20px;
    border-radius: 15px;
    background-color: #111; /* even darker background */
    color: #fff;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
}

#refresh {
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    cursor: pointer;
    transition: transform 0.3s ease;
}

#refresh:hover {
    transform: scale(1.1);
}

@media only screen and (max-width: 600px) {
    body {
        font-size: 18px;
    }

    #fact-container {
        font-size: 18px;
        padding: 10px;
    }

    #refresh {
        width: 40px;
        height: 40px;
    }
}
