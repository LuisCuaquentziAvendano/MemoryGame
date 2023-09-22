const allCards = document.querySelectorAll(".memoryCard")
const timerBox = document.getElementById("timer")
const attemptsBox = document.getElementById("attempts")
const restartButton = document.getElementById("restartButton")
let lockBoard = true
let firstCard
let attempts, pairsFound
let imageOrder = []
let startTime
let timerInterval

// This function shuffle all images (their names)
function shuffle() {
    let j, aux
    for (i = 0; i < imageOrder.length; i++) {
        j = Math.floor(Math.random() * (i + 1))  // Index between 0-19
        aux = imageOrder[i]
        imageOrder[i] = imageOrder[j]
        imageOrder[j] = aux
    }
}

// This function prepares the cards and
// global variables to start a new game
function initializeGame() {
    shuffle()  // Shuffle images
    allCards.forEach((card) => {
        let framework = card.getAttribute("data-framework")  // This is a unique identifier for each card (0-19)
        let image = card.querySelector("img")
        card.addEventListener("click", flipCard)  // Activate the current card
        image.style.display = "none"  // Hide the image attribute of the card
        image.setAttribute("src", imageOrder[framework])  // Assign an image to the current card
    })
    firstCard = null
    secondCard = null
    attempts = -1
    pairsFound = 0
    updateAttempts()
    startTimer()
    lockBoard = false
}

// This function is called everytime a card is clicked
// It checks if it's valid that card or not
function flipCard() {
    let image = this.querySelector("img")
    if (lockBoard)  // The board is blocked, ignore the click
        return
    if (this === firstCard)  // The first card was clicked again, ignore it
        return
    image.style.display = "inline"  // Show the clicked card
    if (firstCard == null) {  // This is the first card clicked
        firstCard = this
        return
    }
    lockBoard = true  // This avoids uncover more cards at the same time
    updateAttempts()
    checkForMatch(firstCard, this)  // "this" is the second card clicked
    firstCard = null
}

// This function checks if the pair uncovered is correct,
// and also checks if the user has already won
function checkForMatch(firstCardCopy, secondCardCopy) {
    let image1 = firstCardCopy.querySelector("img")
    let image2 = secondCardCopy.querySelector("img")
    if (image1.src === image2.src) {  // The pair is correct
        // The uncovered cards will stay block the rest of the game
        firstCardCopy.removeEventListener("click", flipCard)
        secondCardCopy.removeEventListener("click", flipCard)
        pairsFound++
        if (pairsFound == 10) {  // The user found all pairs
            stopTimer()
            finishGame()
        } else
            lockBoard = false
        return
    }
    // The pair it's not correct
    setTimeout(() => {  // This waits 2 seconds before hide the cards
        image1.style.display = "none"
        image2.style.display = "none"
        lockBoard = false
    }, 2000)
}

// This function stops the timer and
// alerts the user that he/she has won the game
function finishGame() {
    setTimeout(() => {
        alert("GANASTE !!!") 
    }, 2000)
}

// This function adds 1 to the number of
// attempts and sets the new value in the screen
function updateAttempts() {
    attempts++
    attemptsBox.textContent = attempts
}

// The next functions are for the timer
// This is for start the timer
function startTimer() {
    timerBox.textContent = "00:00"
    startTime = new Date().getTime()  // This is the time when the game starts
    timerInterval = setInterval(updateTimer, 1000)  // Update timer each second
}

// This function subtracts the start time minus
// the actual time, then it's converted from
// miliseconds into minutes and seconds
function updateTimer() {
    let currentTime = new Date().getTime()
    let elapsedTime = currentTime - startTime
    let seconds = Math.floor(elapsedTime / 1000)
    let minutes = Math.floor(seconds / 60)
    let remainingSeconds = seconds % 60
    timerBox.textContent = String(minutes).padStart(2, '0')
                    + ":" + String(remainingSeconds).padStart(2, '0')
}

// This function stops the timer,
// so it will stay static (showing the last time)
function stopTimer() {
    clearInterval(timerInterval)
}

// Main
for (i = 0; i < 10; i++) {  // Add to a list all the picture names
    imageOrder.push("picture" + i + ".jpg")  // The images are in pairs
    imageOrder.push("picture" + i + ".jpg")
}
restartButton.addEventListener("click", initializeGame)
