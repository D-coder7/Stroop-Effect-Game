// List of colors
var colors = ["red", "blue", "green", "yellow", "orange", "purple"];

// Variables to track game progress
var numTrials = 5;  // Number of trials
var currentTrial = 0;  // Current trial index
var correctCount = 0;  // Count of correct responses
var responseTimes = [];  // Array to store response times

var timeLimit = 5;  // Time limit for each trial in seconds
var timerInterval;  // Reference to the timer interval

var startTime;

// Function to shuffle an array
function shuffleArray(array) {
    var currentIndex = array.length;
    var temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Function to generate a random trial
function generateTrial() {
    var colorWord = colors[Math.floor(Math.random() * colors.length)];
    var colorText = colors[Math.floor(Math.random() * colors.length)];
    while (colorText === colorWord) {
        colorText = colors[Math.floor(Math.random() * colors.length)];
    }
    var colorOptions = shuffleArray(colors.slice());
    return { colorWord: colorWord, colorText: colorText, colorOptions: colorOptions };
}

// Function to update the trial and game progress
function updateTrial() {
    if (currentTrial < numTrials) {
        var trial = generateTrial();
        document.getElementById("colorWord").innerText = trial.colorWord;
        document.getElementById("colorWord").style.color = trial.colorText;
        document.getElementById("choices").innerHTML = "";
        trial.colorOptions.forEach(function (colorOption) {
            var button = document.createElement("button");
            button.classList.add("choice-button");
            button.innerText = colorOption;
            button.style.backgroundColor = colorOption;
            button.onclick = function () {
                stopTimer();
                checkResponse(colorOption);
            };
            document.getElementById("choices").appendChild(button);
        });
        document.getElementById("feedback").innerText = "";
        // document.getElementById("stats").innerText = "Trial " + (currentTrial + 1) + " of " + numTrials;

        startTimer();
    } else {
        // Game over
        stopTimer();
        // location.href = "game-over.html";
        var accuracy = (correctCount / numTrials) * 100;
        var averageTime = calculateAverageTime(responseTimes);
        document.getElementById("colorWord").innerText = "Game Over!";
        document.getElementById("colorWord").style.color = "#FF00F5";
        document.getElementById("choices").innerHTML = "";
        document.getElementById("feedback").innerText = "Accuracy: " + accuracy.toFixed(2) + "%";
        document.getElementById("stats").innerText = "Average Response Time: " + averageTime.toFixed(2) + " seconds";
    }
}

// Function to check the user's response
function checkResponse(selectedColor) {
    var colorWord = document.getElementById("colorWord").innerText.toLowerCase();
    var colorText = document.getElementById("colorWord").style.color.toLowerCase();
    var feedback = document.getElementById("feedback");

    var correct = selectedColor === colorText;
    if (correct) {
        feedback.style.color = "green";
        feedback.innerText = "Correct!";
        correctCount++;
    } else {
        feedback.style.color = "red";
        feedback.innerText = "Incorrect!";
    }

    var endTime = new Date().getTime();
    var responseTime = (endTime - startTime) / 1000;
    responseTimes.push(responseTime);

    currentTrial++;
    setTimeout(updateTrial, 1000);
}

// Function to calculate the average response time
function calculateAverageTime(responseTimes) {
    if (responseTimes.length === 0) {
        return 0.0;
    }
    var total = responseTimes.reduce(function (sum, time) {
        return sum + time;
    }, 0);
    return total / responseTimes.length;
}

// Function to start the timer
function startTimer() {
    startTime = new Date().getTime();
    var timeLeft = timeLimit;
    updateTimerDisplay(timeLeft);

    timerInterval = setInterval(function () {
        timeLeft--;
        updateTimerDisplay(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            checkResponse("");  // Empty response for timeout
        }
    }, 1000);
}

// Function to stop the timer
function stopTimer() {
    clearInterval(timerInterval);
}

// Function to update the timer display
function updateTimerDisplay(timeLeft) {
    document.getElementById("stats").innerText = "Time left: " + timeLeft + "s";
}

// Function to restart the game
function restartGame() {
    currentTrial = 0;
    correctCount = 0;
    responseTimes = [];
    // startTime = new Date().getTime();
    updateTrial();
}

// Start the game
restartGame();
// var startTime = new Date().getTime();