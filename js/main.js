// Start button
let  startButton = document.querySelector(".control-button span");

startButton.onclick = function(){

    let yourName = prompt("What Is Your Name?");
    let name = document.querySelector(".info-container .name span");
    if ( yourName == null || yourName == ""){
        name.innerHTML = "unknown"
    }else{
        name.innerHTML = yourName;
    }



    this.parentElement.remove();
    timing()

};
if (localStorage.getItem("user")){
    addToPageFromStorage()
}

let duration = 1000;
let blocksContainer = document.querySelector(".game-container");

let blocks = Array.from(blocksContainer.children);

let orderRange = [...Array(blocks.length).keys()];

shuffle(orderRange);

blocks.forEach((block , index)=>{

    block.style.order = orderRange[index];

    // add event click
    block.addEventListener("click", function(){

        flipBlock(block);
    })
})


function shuffle(array){
    let current = array.length;
    let temp;
    let random ;
    while (current > 0){
        random = Math.floor(Math.random() * current);
        
        current--;
        
        temp = array[current];

        array[current] = array[random];
        array[random] = temp;
    }

    return array;
};

// flip the block
function flipBlock(selectedBlock){
    selectedBlock.classList.add("is-flipped");

    // collected all flipped card

    let allFlippedCards = blocks.filter((flippedBlock) => flippedBlock.classList.contains("is-flipped"));
    
    // selected only two cards
    if (allFlippedCards.length === 2){
        stopClicking();
        matchedBlock(allFlippedCards[0],allFlippedCards[1]);
    }
}
function stopClicking(){
    blocksContainer.classList.add("stop-clicking");

    setTimeout(() => {
        blocksContainer.classList.remove("stop-clicking")
    }, duration);
}
function matchedBlock(firstBlock,secondBlock){
    let triesElement =document.querySelector(".info-container .tries span");

    if (firstBlock.dataset.fruits === secondBlock.dataset.fruits){
        firstBlock.classList.remove("is-flipped");
        secondBlock.classList.remove("is-flipped");

        firstBlock.classList.add("has-matched");
        secondBlock.classList.add("has-matched");
        document.getElementById("good").play();
    }else{
        triesElement.innerHTML = parseInt(triesElement.innerHTML) + 1 ;
        setTimeout(()=>{
            firstBlock.classList.remove("is-flipped");
            secondBlock.classList.remove("is-flipped");
            
        },duration);
        document.getElementById("bad").play();
    };
};
//timer 
let d = 0;
let count; // Declare count globally to be accessible

function timing() {
    count = setInterval(() => {
        document.querySelector(".timer span").innerHTML = ++d;
        if (d >= 120) {
            clearInterval(count);
            gameOverDiv();
        }
        // Check for win condition after every second
        let allMatched = [...blocks].every(block => block.classList.contains("has-matched"));
        if (allMatched && d < 120) {
            clearInterval(count);
            winDiv();
            addToStorage(); // Call addToStorage when the game is won
        }
    }, 1000);
}



function winDiv(){
    let div = document.createElement("div");
    div.className="game-win";
    let span = document.createElement("span");
    span.className = "text";
    span.appendChild(document.createTextNode("Win"));
    div.appendChild(span);
    document.body.appendChild(div);
    document.getElementById("good").play();
    let btn = document.createElement("span");
    btn.className="btn";
    btn.appendChild(document.createTextNode("Restart"));
    div.appendChild(btn);
    // reload the page
    btn.onclick = function() {
        window.location.reload();
    }
}

function gameOverDiv(){
    let div = document.createElement("div");
    div.className="game-over";
    let span = document.createElement("span");
    span.className = "text";
    span.appendChild(document.createTextNode("Game Over"));
    div.appendChild(span);
    document.body.appendChild(div);
    document.getElementById("game-over").play();
    let btn = document.createElement("span");
    btn.className="btn";
    btn.appendChild(document.createTextNode("Restart"));
    div.appendChild(btn);
    // reload the page
    btn.onclick = function() {
        window.location.reload();
    }
    
}

function addToStorage() {
    // Check if all blocks have the "has-matched" class
    const allMatched = [...blocks].every(block => block.classList.contains("has-matched"));

    if (allMatched) {
        const personName = document.querySelector(".info-container .name span").innerHTML;
        const takeTime = document.querySelector(".timer span").innerHTML;
        const tries = document.querySelector(".info-container .tries span").innerHTML;

        const person = {
            name: personName,
            time: takeTime,
            try: tries,
        };

        window.localStorage.setItem("user",JSON.stringify(person));
    }
}

function addToPageFromStorage(){
    let data = JSON.parse(localStorage.getItem("user"));
    let divStat = document.querySelector(".show");
    let p = document.createElement("p");
    p.appendChild(document.createTextNode(`The Name: ${data.name} His Time: ${data.time} Number Of tries:${data.try}`));
    divStat.appendChild(p);
}