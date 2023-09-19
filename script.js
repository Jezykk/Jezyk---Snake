var canvas = document.getElementById("game_area");
var context = canvas.getContext("2d");

var score = document.getElementById("score");
var startBtn = document.getElementById("startBtn");
var fruit = document.getElementById("fruit");
var virus = document.getElementById("virus");
var snakeHeadX, snakeHeadY, fruitX, fruitY, virusX, virusY, tail, totalTail, directionVar, direction, previousDir;
var speed=1, xSpeed, ySpeed;
var scale = 40;
var rows = canvas.height / scale;
var columns = canvas.width / scale;
var min = scale / 40; //for min coordinate of fruit
var max = rows - min; //for max 
var gameInterval,  //interval after which screen will be updated
    virusInterval, //interval after which virus position will be updated
    intervalDuration=70, //starting screen updation interval
    minDuration=75; //minimum screen updation interval
var playing, gameStarted;
var boundaryCollision;
var tail0;
startBtn.addEventListener("click",startGame);

//reset the variables to starting value
function reset() {
    clearInterval(gameInterval);
    clearInterval(virusInterval);
    intervalDuration=150, 
    minDuration=75;
    tail = [];
    totalTail = 0;
    scale = 40;
    directionVar = "Right";
    direction = "Right";
    previousDir = "Right";
    xSpeed = scale * speed;
    ySpeed = 0;
    snakeHeadX = 0;
    snakeHeadY = 0;
    playing=false, gameStarted=false;
    boundaryCollision=false;
}

function startGame() {
    reset();
    gameStarted=true;
    playing=true;
    fruitPosition();
    virusPosition();
    main();
}

//EventListener to check which arrow key is pressed
window.addEventListener("keydown", pressedKey);

function pressedKey() {
    if(event.keyCode===32 && gameStarted) {
        if(playing) {
            pauseGame();
        }
        else{
            resumeGame();
        }
    }
    else {
        previousDir = direction;
        directionVar = event.key.replace("Arrow", "");
        changeDirection();
    }
}

//change the direction of snake based on arrow key pressed
function changeDirection() {
    switch (directionVar) {
        case "Up":
            //move "up" only when previous direction is not "down"
            if (previousDir !== "Down") {
                direction=directionVar;
                xSpeed = 0;
                ySpeed = scale * -speed;
            } 
            break;

        case "Down":
            //move "down" only when previous direction is not "up"
            if (previousDir !== "Up") {
                direction=directionVar;
                xSpeed = 0;
                ySpeed = scale * speed;
            } 
            break;

        case "Left":
            //move "left" only when previous direction is not "right"
            if (previousDir !== "Right") {
                direction=directionVar;
                xSpeed = scale * -speed;
                ySpeed = 0;
            } 
            break;

        case "Right":
            //move "right" only when previous direction is not "left"
            if (previousDir !== "Left") {
                direction=directionVar;
                xSpeed = scale * speed;
                ySpeed = 0;
            } 
            break;
    }
}

//random coordinates for fruit or virus
function generateCoordinates() {
    let xCoordinate = (Math.floor(Math.random() * (max - min) + min)) * scale;
    let yCoordinate = (Math.floor(Math.random() * (max - min) + min)) * scale;
    return {xCoordinate, yCoordinate};
}

//check snake's collision 
function checkCollision() {
    let tailCollision=false, virusCollision=false;
    boundaryCollision=false;
    //with its own tail
    for (let i = 0; i < tail.length; i++) {
        if (snakeHeadX == tail[i].tailX && snakeHeadY == tail[i].tailY) {
            tailCollision=true;
        }
    }
    //with boundaries
    if(snakeHeadX >= canvas.width || snakeHeadX < 0 || snakeHeadY >= canvas.height || snakeHeadY < 0)
    {
        boundaryCollision=true;
    }
    //with virus
    if(snakeHeadX===virusX && snakeHeadY===virusY) {
        virusCollision=true;
    }
    return (tailCollision || boundaryCollision || virusCollision);
}

//-----------------------------------------------------SNAKE-----------------------------------------------------------//
function drawSnakeHead(color) {
        context.beginPath();
        context.arc(snakeHeadX+scale/2, snakeHeadY+scale/2, scale/2, 0, 2 * Math.PI);
        context.fillStyle = color;
        context.fill();
        //eyes
        context.beginPath();
        if(direction==="Up") {
            context.arc(snakeHeadX+(scale/5), snakeHeadY+(scale/5), scale/8, 0, 2 * Math.PI);
            context.arc(snakeHeadX+scale-(scale/5), snakeHeadY+(scale/5), scale/8, 0, 2 * Math.PI);
        }
        else if(direction==="Down") {
            context.arc(snakeHeadX+(scale/5), snakeHeadY+scale-(scale/5), scale/8, 0, 2 * Math.PI);
            context.arc(snakeHeadX+scale-(scale/5), snakeHeadY+scale-(scale/5), scale/8, 0, 2 * Math.PI);
        }
        else if(direction==="Left") {
            context.arc(snakeHeadX+(scale/5), snakeHeadY+(scale/5), scale/8, 0, 2 * Math.PI);
            context.arc(snakeHeadX+(scale/5), snakeHeadY+scale-(scale/5), scale/8, 0, 2 * Math.PI);
        }
        else {
            context.arc(snakeHeadX+scale-(scale/5), snakeHeadY+(scale/5), scale/8, 0, 2 * Math.PI);
            context.arc(snakeHeadX+scale-(scale/5), snakeHeadY+scale-(scale/5), scale/8, 0, 2 * Math.PI);
        }
        context.fillStyle = "white";
        context.fill();
}

function drawSnakeTail() {
    let tailRadius = scale/4;
        for (i = 0; i < tail.length; i++) {
            tailRadius=tailRadius+((scale/2-scale/4)/tail.length);
            context.beginPath();
            context.fillStyle = `#${Math.floor(Math.random()*16777215).toString(16)}`;
            context.arc((tail[i].tailX+scale/2), (tail[i].tailY+scale/2), tailRadius, 0, 2 * Math.PI);
            context.fill();
        }
}

//shift snake's previous positions to next position
function moveSnakeForward() {
    tail0=tail[0];
    for (let i = 0; i < tail.length - 1; i++) {
        tail[i] = tail[i + 1];
    }
    tail[totalTail - 1] = { tailX: snakeHeadX, tailY: snakeHeadY };
    snakeHeadX += xSpeed;
    snakeHeadY += ySpeed;
}

//only in case of boundary collision
function moveSnakeBack()
{
    context.clearRect(0, 0, 800, 600);
    for (let i = tail.length-1; i >= 1; i--) {
        tail[i] = tail[i - 1];
    }
    if(tail.length>=1) {
        tail[0] = { tailX: tail0.tailX, tailY: tail0.tailY };
    }
    snakeHeadX -= xSpeed;
    snakeHeadY -= ySpeed;
    drawVirus();
    drawFruit();
    drawSnakeTail();
}

//display snake
function drawSnake() {
    drawSnakeHead("#00b700");
    drawSnakeTail();
    if (checkCollision()) {
        clearInterval(gameInterval);
        clearInterval(virusInterval);
        if(boundaryCollision) {
            moveSnakeBack();
        }
        drawSnakeHead("orange");
        setTimeout(()=>{ 
            scoreModal.textContent = totalTail;
            $('#alertModal').modal('show');
            //if modal is shown, remove the keydown event listener so that snake doesn't move 
            $( "#alertModal" ).on('shown.bs.modal', function(){
                window.removeEventListener("keydown", pressedKey);
            });
            //when modal hides, reset every variable and add keydown event listener again
            $('#alertModal').on('hidden.bs.modal', function () {
                context.clearRect(0, 0, 800, 600);
                score.innerText = 0;
                window.addEventListener("keydown", pressedKey);
                reset();
              })
            modalBtn.addEventListener("click", ()=>{
                context.clearRect(0, 0, 800, 600);
                score.innerText = 0;
            });
        }, 1000);
    }
}


//------------------------------------------------------VIRUS-----------------------------------------------------------//
function virusPosition() {
    let virus=generateCoordinates();
    virusX=virus.xCoordinate;
    virusY=virus.yCoordinate;
}

function drawVirus() {
    context.drawImage(virus, virusX, virusY, scale, scale);
}
function drawExtraVirus() {
    for (let i=0; i<4; i++){
        context.drawImage(virus, virusY, virusX, scale, scale);
    }
}
//------------------------------------------------------FRUIT-----------------------------------------------------------//
//generate random fruit position within canvas boundaries
function fruitPosition() {
    let fruit=generateCoordinates();
    fruitX=fruit.xCoordinate;
    fruitY=fruit.yCoordinate;
}

//draw image of fruit
function drawFruit() {
    context.drawImage(fruit, fruitX, fruitY, scale, scale);
}

//---------------------------------------------------CHANGE GAME SIZE---------------------------------------------------------//
function changeSize(){
    if(totalTail >= 2){
        scale = 20;
        rows = canvas.height / scale;
        columns = canvas.width / scale;
        min = scale / 10; 
        max = rows - min;
        drawExtraVirus();
    }
    if(checkCollision){
        gameStarted=true;
        playing=true;
    }else{
        reset();
    };
}


//------------------------------------------------------MAIN GAME-----------------------------------------------------------//
function checkSamePosition() {
    if(fruitX==virusX && fruitY==virusY) {
        virusPosition();
    }
    for(let i=0; i< tail.length; i++){
        if(virusX===tail[i].tailX && virusY===tail[i].tailY)
        {
            virusPosition();
            break;
        }
    }
    for(let i=0; i< tail.length; i++){
        if(fruitX===tail[i].tailX && fruitY===tail[i].tailY)
        {
            fruitPosition();
            break;
        }
    }
}

function main() {
    //update state at specified interval
    virusInterval = window.setInterval(virusPosition, 10000);
    gameInterval = window.setInterval(() => {
        context.clearRect(0, 0, 800, 600);
        checkSamePosition();
        drawVirus();
        drawFruit();
        moveSnakeForward();
        drawSnake();
        changeSize();
        //check if snake eats the fruit - increase size of its tail, update score and find new fruit position
        if (snakeHeadX === fruitX && snakeHeadY === fruitY) {
            totalTail++;
            //increase the speed of game after every 15 points
            if(totalTail%12==0 && intervalDuration>minDuration) {
                clearInterval(gameInterval);
                window.clearInterval(virusInterval);
                intervalDuration=intervalDuration-10;
                main();
            }
            fruitPosition();
        }
        score.innerText = totalTail;

    }, intervalDuration);
}