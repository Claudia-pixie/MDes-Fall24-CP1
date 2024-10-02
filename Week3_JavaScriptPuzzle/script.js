let list = ["🥴", "🥴", "🤪", "🤪", "😤", "😤", "🤯", "🤯"];
shuffle(list)

let gameBoard = document.getElementById("game-board"); //game-board div html element

let button = document.getElementById("restart-button");
button.addEventListener("click", function(event){
    location.reload();
})



// initial
let firstCard;
let secondCard;
let lock = false;

// loop every item in the list
list.forEach(function (element) {
    let card = document.createElement("div")
    card.classList.add("card")
    card.dataset.value = element; // dataset key:value
    card.innerHTML = "?" // show ?
    
    card.addEventListener("click", function (event) {
        // console.log(event.target);
        flipcard(event.target)
    })
    gameBoard.appendChild(card)
});

// define
function flipcard(card) {
    if (lock == false) {
        // 1. change card style and content
        card.innerHTML = card.dataset.value;
        card.classList.add("flipped")

        // 2. flip 2 cards
        if (firstCard == null) {
            firstCard = card;
        } else {
            secondCard = card;
            lock = true

            // 3. check cards equal
            checkMatch(firstCard, secondCard);
        }
    } else {

    }
}

function checkMatch(card1, card2) {
    
    if(card1.dataset.value === card2.dataset.value) { // match
        // keep flipped
        resetState();
    } else { // no match
        setTimeout(resetCardAndState, 1000);

        // firstCard = null
        // secondCard = null
    }
}

function resetCardAndState(){

    resetCard(firstCard)
    resetCard(secondCard)
    resetState()
}

function resetCard(card) {
    card.innerHTML = "?";
    card.classList.remove("flipped")
}

function resetState() {
    firstCard = null
    secondCard = null
    lock = false
}

function shuffle(list) {
    // exchange index randomly
    // let item = list[0] 
    for (let index = 0; index < list.length; index++) {
        let randomIndex = Math.floor(Math.random() * list.length)  // 0 - last index

        // exchange
        let temp = list[index]; 
        list[index] = list[randomIndex]
        list[randomIndex] = temp

    }


}