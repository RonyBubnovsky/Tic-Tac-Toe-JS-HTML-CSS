let turnCounter = 0;
let gameArray = [0,0,0,0,0,0,0,0,0];
let currentResult = '';
const results = JSON.parse(localStorage.getItem('scores')) || {
    xWins: 0, 
    oWins: 0, 
    draws: 0
};
function checkGameStatus() {
    console.log(gameArray);

    if (gameArray[0] === gameArray[4] && gameArray[0] === gameArray[8]) {
        if (gameArray[0] === 1) {
            return 'x';
        }
        else if (gameArray[0] === 2) {
            return 'o';
        }
    }

    if (gameArray[2] === gameArray[4] && gameArray[2] === gameArray[6]) {
        if (gameArray[2] === 1) {
            return 'x';
        }
        else if (gameArray[2] === 2) {
            return 'o';
        }
    }

    if (gameArray[0] === gameArray[1] && gameArray[0] === gameArray[2]) {
        if (gameArray[0] === 1) {
            return 'x';
        }
        else if (gameArray[0] === 2) {
            return 'o';
        }
    }

    if (gameArray[3] === gameArray[4] && gameArray[3] === gameArray[5]) {
        if (gameArray[3] === 1) {
            return 'x';
        }
        else if (gameArray[3] === 2) {
            return 'o';
        }
    }

    if (gameArray[6] === gameArray[7] && gameArray[6] === gameArray[8]) {
        if (gameArray[6] === 1) {
            return 'x';
        }
        else if (gameArray[6] === 2) {
            return 'o';
        }
    }

    if (gameArray[0] === gameArray[3] && gameArray[0] === gameArray[6]) {
        if (gameArray[0] === 1) {
            return 'x';
        }
        else if (gameArray[0] === 2) {
            return 'o';
        }
    }

    if (gameArray[1] === gameArray[4] && gameArray[1] === gameArray[7]) {
        if (gameArray[1] === 1) {
            return 'x';
        }
        else if (gameArray[1] === 2) {
            return 'o';
        }
    }

    if (gameArray[2] === gameArray[5] && gameArray[2] === gameArray[8]) {
        if (gameArray[2] === 1) {
            return 'x';
        }
        else if (gameArray[2] === 2) {
            return 'o';
        }
    }

    else if (turnCounter === 9) {
        return 'draw';
    }

    return 'continue';
}

function playGame(buttonPressed, index) {
    if (currentResult === 'draw' || currentResult === 'x' || currentResult === 'o') {
        return;
    }

    const buttonElement = document.querySelector(`.${buttonPressed}`);

    if (gameArray[index] === 1 || gameArray[index] === 2) {
        document.querySelector('.error-container').innerHTML = 'Please select an empty square!';
        return;
    }

    document.querySelector('.error-container').innerHTML = '';

    if (turnCounter % 2 === 0) {
        document.querySelector('.turn-container').innerHTML = 'Player O Turn :';
        buttonElement.innerHTML = 'X';
        buttonElement.classList.add('x-style');
        gameArray[index] = 1;
    }
    else {
        document.querySelector('.turn-container').innerHTML = 'Player X Turn :';
        buttonElement.innerHTML = 'O';
        buttonElement.classList.add('o-style');
        gameArray[index] = 2;
    }
    turnCounter++;

    currentResult = checkGameStatus();

    if (currentResult === 'continue') {
        return;
    }

    else if (currentResult === 'x') {
        document.querySelector('.turn-container').innerHTML = '';
        document.querySelector('.result-container').innerHTML = 'Player X WON! &#x1F44D;';
        document.querySelector('.reset-button').innerHTML = 'Play Again';
        results.xWins++;
        localStorage.setItem('scores', JSON.stringify(results));
        document.querySelector('.results').innerHTML = `X-WINS: ${results.xWins}, O-WINS: ${results.oWins}, DRAWS: ${results.draws}`;
        return;
    }

    else if (currentResult === 'o') {
        document.querySelector('.turn-container').innerHTML = '';
        document.querySelector('.result-container').innerHTML = 'Player O WON! &#x1F44D;';
        document.querySelector('.reset-button').innerHTML = 'Play Again';
        results.oWins++;
        localStorage.setItem('scores', JSON.stringify(results));
        document.querySelector('.results').innerHTML = `X-WINS: ${results.xWins}, O-WINS: ${results.oWins}, DRAWS: ${results.draws}`;
        return;
    }

    document.querySelector('.result-container').innerHTML = 'DRAW! &#x1F44D;';
    document.querySelector('.reset-button').innerHTML = 'Play Again';
    document.querySelector('.turn-container').innerHTML = '';
    results.draws++;
    localStorage.setItem('scores', JSON.stringify(results));
    document.querySelector('.results').innerHTML = `X-WINS: ${results.xWins}, O-WINS: ${results.oWins}, DRAWS: ${results.draws}`;
    return;


}

function resetGame() {
    document.querySelector('.reset-button').innerHTML = 'Reset Game';
    turnCounter = 0; 
    currentResult = ''; 
    for (let i = 0; i<gameArray.length; i++) {
        gameArray[i] = 0;
    }
    resetButton('first-button');
    resetButton('second-button');
    resetButton('third-button');
    resetButton('fourth-button');
    resetButton('fifth-button');
    resetButton('sixth-button');
    resetButton('seventh-button');
    resetButton('eigth-button');
    resetButton('ninth-button');
    document.querySelector('.turn-container').innerHTML = 'Player X Turn :';
    document.querySelector('.error-container').innerHTML = '';
    document.querySelector('.result-container').innerHTML = '';
}

function resetButton(b) {
    const bElement = document.querySelector(`.${b}`);

    bElement.innerHTML = '';

    if (bElement.classList.contains('x-style')) {
        bElement.classList.remove('x-style');
    }

    else if (bElement.classList.contains('o-style')) {
        bElement.classList.remove('o-style');
    }



}

function resetScores () {
    localStorage.removeItem('scores');
    results.draws = 0;
    results.oWins = 0; 
    results.xWins = 0;
    document.querySelector('.results').innerHTML = `X-WINS: ${results.xWins}, O-WINS: ${results.oWins}, DRAWS: ${results.draws}`;
}

function showScores() {
    document.querySelector('.results').innerHTML = `X-WINS: ${results.xWins}, O-WINS: ${results.oWins}, DRAWS: ${results.draws}`;
}

window.addEventListener("load", showScores);
