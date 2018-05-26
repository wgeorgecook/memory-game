// TODO: Deploy animate.css if time allows


// Create a counter to check for matches
let matchCount = 0;

// Check if this is a new game
let newGame = true;

// Hold cards in play
let heldCards = [];

// object of all potential classes
cardIDs = [
    "fa-cube", "fa-paper-plane-o", "fa-bicycle", 
    "fa-bolt", "fa-bomb", "fa-leaf", 
    "fa-diamond", "fa-anchor", 
];

allCards = cardIDs.concat(cardIDs); // double up on the card icons


 // Timer 
 let timer = null;

 // Set up the board when the DOM is ready
 document.addEventListener('DOMContentLoaded', reset(), false);



// Add event listners for clicks 
document.addEventListener("click", function(event) {
    let thisCard = event.target;

    // event listener for shuffle
    if (event.target.className === "fa fa-repeat") {
        newGame = true;
        reset();
    };

    // event listener for cards
    if (thisCard.className === "card") {
        if (newGame === true) {
            startTimer();
        };
        newGame = false;
        flipCard(thisCard);
        holdCards(thisCard);
    };
});



/*
*
*  Functions dealing with starting over
*
*/

// Reset the board
function reset() {
    resetTimer();
    unFlipAll();
    unHoldCards();
    shuffleCards(allCards);
    setScoreToZero();
    unMatchCards();
};

function unFlipAll() { // Set all cards to hidden
    let cards = document.getElementsByClassName("card");
    for (c = 0; c < cards.length; c ++) {
        cards[c].classList.remove("match");
        cards[c].classList.remove("show");
        cards[c].classList.remove("open");
    };
};

function unHoldCards() {
    heldCards = [];
};

function unMatchCards() {
    matchCount = 0;
}
function setScoreToZero() { // Removes stars and sets count to zero
    let score = document.querySelector(".moves").textContent = "0";
    // puts stars back
    let stars = document.querySelector(".stars");
    while (stars.childElementCount < 3) {
        stars.insertAdjacentHTML("afterBegin", '<li><i class="fa fa-star"></i></li>');
    };
};

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

// Shuffle all the cards when reset
function shuffleCards(array) {
    let deck = document.querySelector(".deck");
    let shuffledCards = shuffle(allCards);
    let cards = document.getElementsByClassName("card");

    for (v = 0; v < deck.childElementCount; v ++) { // reset all icons
        cards[v].firstElementChild.classList = "fa";
    };

    for (i = 0; i < deck.childElementCount; i ++) { 
        deck.children[i].firstElementChild.classList.add(shuffledCards[i]); // set new icon classes
    };  
};

function resetTimer() {
    clearInterval(timer);
    let timerClass = document.querySelector(".timer");
    timerClass.innerHTML= '<i id="min">00</i>:<i id="sec">00</i>';
};

/*
*
* Functions dealing with core gameplay
*
*/

// Hold the cards
function holdCards(card) {
    heldCards.push(card);
    let heldCardsClasses = card.firstElementChild.classList;
    let  minutes = null;
    if (heldCards.length === 2) {
        if (checkMatch(heldCards[0].firstElementChild.classList, heldCards[1].firstElementChild.classList) === true ) { // see if both cards held are matches
            keepOpen(heldCards[0], heldCards[1]);
            heldCards = [];
            matchCount += 1;
            if (checkWin() === true) { // only check if win on a match
                setTimeout(function() {
                    if (document.querySelector("#min") === undefined) {
                        minutes = "00";
                    } else {
                        minutes = document.querySelector("#min").textContent;
                    };
                    let winning = 
                    `You've won! Try again to beat your score:
                    ${document.querySelector(".moves").textContent} moves
                    ${minutes} minutes and ${document.querySelector("#sec").textContent} seconds
                    Your rating was ${document.querySelector(".stars").childElementCount}`;
                    confirm(winning);
                    reset();
                    newGame = true, 500 }
                )}; 
        }  else {
            unFlipCards(heldCards[0], heldCards[1]);
            heldCards = [];
        };
    };
};

// Flip a card to reveal an icon
function flipCard(card) {
    let cardClasses = card.classList;
    cardClasses.add("show");
    cardClasses.add("open"); 
};

// Undo the flip if not matched
function unFlipCards(card1, card2) {
    let cardOneClasses = card1.classList;
    let cardTwoClasses = card2.classList;
    setTimeout(function() { // give it some time
        cardOneClasses.remove("show");
        cardOneClasses.remove("open"); 
        cardTwoClasses.remove("show");
        cardTwoClasses.remove("open"); 
    }, 500);
    incrementScore();
};

// keep cards open when matched
function keepOpen(card1, card2) {
    card1.classList.add("match");
    card2.classList.add("match");
    incrementScore();
};


// check to see if both cards in heldCards are matches
function checkMatch(card1, card2) {
    if (card1.toString() === card2.toString()) {
        return true;
    } else {
        return false;
    };
};
// start the timer
function startTimer() {
    let minutesElapsed = parseFloat(document.querySelector("#min").textContent);
    let secondsElapsed = parseFloat(document.querySelector("#sec").textContent);
    let minutes = document.querySelector("#min").textContent;
    let seconds = document.querySelector("#sec").textContent;
    timer = ( setInterval( function timer() {
        secondsElapsed += 1;
        if ( secondsElapsed > 59 ) {
            secondsElapsed = 0;
            minutesElapsed += 1;
        };
        if (minutesElapsed <= 9 ) {
            let lowMinutesElapsed = "0" + minutesElapsed; 
            if ( secondsElapsed <= 9 ) {
                let lowSecondsElapsed = "0" + secondsElapsed; 
                document.querySelector("#min").textContent = lowMinutesElapsed;
                document.querySelector("#sec").textContent = lowSecondsElapsed;
            } else { 
                document.querySelector("#min").textContent = lowMinutesElapsed;
                document.querySelector("#sec").textContent = secondsElapsed;
            };
        } else {
            document.querySelector("#min").textContent = minutesElapsed;
            document.querySelector("#sec").textContent = secondsElapsed;
        };
        }, 1000 ) 
    );
};


// Increment the score
function incrementScore() {
    // increase the numerical value of the score
    let old_score = document.querySelector(".moves").textContent;
    let new_score = parseInt(old_score) + 1;
    document.querySelector(".moves").textContent = new_score;

    // remove stars when score gets high
    let stars = document.querySelector(".stars");

    if (new_score === 15) { 
        stars.removeChild(stars.lastElementChild); 
    } else if (new_score === 5) {
        stars.removeChild(stars.lastElementChild);
    };
};

// Determine if this round was the final round
function checkWin() {
    if (matchCount === 8) {
        return true;
    } else {
    return false;
    };
};