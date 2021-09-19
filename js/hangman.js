let randomWord = "";
let totalGuesses = 0;
let incorrectGuess = 0;
let correctGuess = 0;
let isCorrectGuess = false;
let guessedCharacterList = "";

const MAX_GUESSES = 15;
const MAX_INCORRECT_GUESSES = 8;

$(document).ready(function() {
    let index = Math.floor(Math.random() * (WORDLIST.length));
    // get a random word to be guessed
    randomWord = WORDLIST[index]; 
    let htmlContent = "<ul>";
    // create the boxes based on the lenght of the word to be guessed
    for (let i = 0; i < randomWord.length; i++) {
        htmlContent += '<li class="guessBox"><input type="text" class="form-control box" id="'+i+'" maxlength=1 disabled></li>'; 
    }
    htmlContent += "</ul></div>";
    $(".guessedWord").html(htmlContent);
});

$("#guess").on("input", function() {
    guessEntered = $(this).val().toLowerCase();
    let isCorrectGuess = false;
    if (guessEntered !== '' && !isCharactersAlreadyEntered(guessEntered) && isValidGuess(guessEntered)) { // if the player is not deleting a character.
        if (guessedCharacterList.length === 0) { //player has not yet make any guesses
            guessedCharacterList += guessEntered;
        } else if (guessedCharacterList.indexOf(guessEntered) == -1) { // player has entered a character -> add it to the character list
            guessedCharacterList += ", " + guessEntered;
        }

        $("#alreadyGuessedCharacters").text(`Guesses Made: ${guessedCharacterList}`);
        for (let i = 0; i < randomWord.length; i++) {
            // the guess entered by the player is found in the random word.
            if(guessEntered === randomWord[i]) {
                $(`#${i}`).attr("value", guessEntered);
                correctGuess += 1;
                isCorrectGuess = true;
            }
        }
        totalGuesses += 1;
        $("#totalGuesses").text(`Total Guesses: ${totalGuesses}`);
        
        // player enters invalid guess
        if (!isCorrectGuess) {
            incorrectGuess += 1;
            $("#incorrectGuesses").text(`Incorrect Guesses: ${incorrectGuess}`);
        }
        determineGameStatus();
    }
    clearGuessBox(); // clear the guess box after the player enters a guess
});

function clearGuessBox() {
    // clear the guess box after 500ms
    setTimeout(function() {
        $("#guess").val("");
    }, 500);
}
function isCharactersAlreadyEntered(guessEntered) {
    if ($.inArray(guessEntered, guessedCharacterList) == -1) { //player has not yet made this guess
        $("#alreadyEntered").html("");
        return false;
    }

    // show this alert each time the player enters a guess which he already enters
    $("#alreadyEntered").html(`<div class='alert alert-warning'><em>You already entered this guess: ${guessEntered}.</em></div><br>`);
    // hide the invalid message;
    $("#invalidCharacter").html("");
    return true;
}

// check if the character is a letter
function isValidGuess(guessEntered) {
    // only characters which are not letters will be equal to each other
    if (guessEntered.toLowerCase() === guessEntered.toUpperCase()) {
        $("#invalidCharacter").html("<div class='alert alert-danger'>Invalid Guess. Please enter letter only.</div><br>");
        return false;
    }

    // hide the invalid message;
    $("#invalidCharacter").html("");
    return true;
}

function determineGameStatus() {
    if (totalGuesses > MAX_GUESSES) {
       setGameStatus("<div class='alert alert-danger'><h4 class='text-center'>Game Lost</h4><p class='text-center'>You have exceeded the maximum number of total guesses allowed.<br>The word to be guessed was <q><b><i>" + randomWord + "</i></b></q>.</p></div><br>");
    } else if (incorrectGuess > MAX_INCORRECT_GUESSES) {
       setGameStatus("<div class='alert alert-danger'><h4 class='text-center'>Game Lost</h4><p class='text-center'>You have exceeded the maximum number of incorrect guesses allowed.<br>The word to be guessed was <q><b><i>" + randomWord + "</i></b></q>.</p></div><br>");
    } else if (correctGuess === randomWord.length) {
        setGameStatus("<div class='alert alert-success'><h4 class='text-center'>Congrats!! Game Won</h4><p class='text-center'>You have correctly guessed the word <q><b><i>" + randomWord + "</i></b></q></div><br>");
    }
}

function setGameStatus(text) {
    // hide the game container
    $("#hangmanContainer").hide();
    $("#gameStatus").html(text);
}


