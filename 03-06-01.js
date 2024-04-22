
export {};


// somewhere in your program you'll want a line
// that looks like:
const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas1"));
const ctx = canvas.getContext("2d");
const paddleSound = document.getElementById("paddleSound");


/*
document.getElementById("onePlayer").addEventListener("click", function() {
    startGame("onePlayer");
});

document.getElementById("twoPlayer").addEventListener("click", function() {
    startGame("twoPlayer");
});
*/


let  button1 = document.getElementById('onePlayer_easy');
let  button3 = document.getElementById('onePlayer_medium');
let  button4 = document.getElementById('onePlayer_impossible_to_win');

let  button2 = document.getElementById('twoPlayer');



let two_player = false

//GAMEModes
let easyMode = false;
let mediumMode = false;
let impossibleMode = false;

let play =false;

let move_ball = false;
let obstacles_drawn = false;
let obstacles_drawn2 = false;


//random X position for obstacle
let randomNum = (Math.random() * (10))
let randomX = 0;
let random2X = 0;

if(randomNum <=5){
    randomX = (Math.random() * (100)) + 130;

    random2X = (Math.random() * (100)) + 350;
}
else{
    randomX = (Math.random() * (100)) + 350;
    random2X = (Math.random() * (100)) + 130;

}


let randomY = (Math.random() * (150)) + 250;

let random2Y = (Math.random() * (150)) + 250;

//easy mode button
button1.addEventListener('click', function() {
    two_player = false;
    easyMode = true;
    play =true
    setTimeout(()=>{move_ball= true},2000)

})

//medium mode button
button3.addEventListener('click', function() {
    two_player = false;
    mediumMode = true;
    play =true
    setTimeout(()=>{move_ball= true},2000)


})


//medium mode button
button4.addEventListener('click', function() {
    two_player = false;
    impossibleMode = true;
    play =true
    setTimeout(()=>{move_ball= true},2000)


})

//TWO PLAYER GAME
button2.addEventListener('click', function() {
    two_player = true;
    play =true
    setTimeout(()=>{move_ball= true},2000)


})

 

// Ball properties
let ballX = canvas.width / 2;
let ballY = canvas.height / 2 ;
let ballSpeedX = 5;
let ballSpeedY = 5;
const ballRadius = 10;

// Paddle properties
const paddleHeight = 100;
const paddleWidth = 10;
let player1Y = (canvas.height - paddleHeight) / 2;
let player2Y = (canvas.height - paddleHeight) / 2;

// Score
let player1Score = 0;
let player2Score = 0;
let gameOver = false;
let winner = "";

// Key state
let upPressed = false;
let downPressed = false;

let IPressed = false;
let KPressed = false;



// Draw function
function draw() {
    


    

    if( play){
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

    // Draw the paddles
    ctx.beginPath();
    ctx.rect(0, player1Y, paddleWidth, paddleHeight);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(canvas.width - paddleWidth, player2Y, paddleWidth, paddleHeight);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();

    //OBSTACLE
    let randomTime = (Math.random() * (10000)) + 5000;
    let randomTime2 = (Math.random() * (50000)) + 5000;

    setTimeout(()=>{obstacles_drawn= true},randomTime)
    setTimeout(()=>{obstacles_drawn2= true},randomTime2)


    if(obstacles_drawn){
        ctx.beginPath();

        /*
        if (((ballX+ballRadius > randomX) &&  (ballX-ballRadius < randomX+50) &&  (ballY-ballRadius < randomY+50) && (ballY+ballRadius > randomY))){   
            randomX = randomX - 150
            randomY = randomY - 150
        }              
        */
       
        ctx.rect(randomX, randomY, 60, 60);
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.closePath();


    }

    if(obstacles_drawn2){
        ctx.beginPath();

        /*
        if (((ballX+ballRadius > randomX) &&  (ballX-ballRadius < randomX+50) &&  (ballY-ballRadius < randomY+50) && (ballY+ballRadius > randomY))){   
            randomX = randomX - 150
            randomY = randomY - 150
        }              
        */
       
        ctx.rect(random2X, random2Y, 60, 60);
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.closePath();


    }
   

    // Draw the scores
    ctx.font = "16px Arial";
    ctx.fillStyle = "blue";
    ctx.fillText("Score: " + player1Score, 8, 20);
    ctx.fillText("Score: " + player2Score, canvas.width - 64, 20);

    // displaying winners
    if (gameOver) {
        ctx.font = "20px Arial";
        ctx.fillStyle = "red";
        ctx.fillText(winner, canvas.width / 2 - 100, 50);
        ctx.fillText("To restart refresh the page or click the \"restart\" button below!", canvas.width / 2 - 300, 90);
      

        let  restart = document.getElementById('restart');

        restart.style = "display:inline-block"
        restart.addEventListener('click', function() {
            location.reload()
        })
        
    }

}
else{
    ctx.font = "16px Arial";
    ctx.fillStyle = "blue";
    ctx.fillText("click One or Two Player Game Mode Below", 150, 100);

}
    //});
}

// Move function
function move() {
    // Move the ball

    if(move_ball){
        ballX += ballSpeedX;
        ballY += ballSpeedY;
    }

    // WALL collisison
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // PADDLES collisison
    if (ballX - ballRadius < paddleWidth) {

        //when hits paddle
        if (ballY > player1Y && ballY < player1Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            playPaddleSound()

        //they scored
        } else {
            player2Score++;

            //setTimeout(resetBall,2000);
            resetBall()
            checkWin();

        }
    } else if (ballX + ballRadius > canvas.width - paddleWidth) {
        if (ballY > player2Y && ballY < player2Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            playPaddleSound()
        } else {
            player1Score++;

            //setTimeout(resetBall,2000);
            resetBall()

            checkWin();
        }
    }

    // Move the paddles
    if (upPressed && player1Y > 0) {
        player1Y -= 7;
    } else if (downPressed && player1Y < canvas.height - paddleHeight) {
        player1Y += 7;
    }

    //CHECKING to see if its 2 player or not
    if (two_player) {
        if (IPressed && player2Y > 0) {
            player2Y -= 7;
        } else if (KPressed && player2Y < canvas.height - paddleHeight) {
            player2Y += 7;
        }
    }
    //IF not two player AI will play
    else{
        
        if(impossibleMode){
            player2Y  = ballY-30

        }

        //Medium Mode check to see how far away AI is from the ball and then Move
        else if(mediumMode){
            let paddleCenter = player2Y + (paddleHeight / 2);

           
                if (paddleCenter < ballY - 44) {
                    player2Y += 5.5;
                } else if (paddleCenter > ballY + 44) {
                    player2Y -= 5.5;
                }
           
        }

        //WORK IN PROGGRESS
        else if(easyMode){
            let x = Math.random() *30
            let y = Math.random() *30

            ballSpeedX = 3;
            ballSpeedY = 3;
        
            player2Y  = player2Y + x -y

            if(player2Y < 150){
                player2Y = player2Y + x +y 
            } 
            if(player2Y > 450){
                player2Y = player2Y - x -y 
            } 
           
        }   
    }

   
    
    if ( obstacles_drawn && ((ballX+ballRadius > randomX) &&  (ballX-ballRadius < randomX+50) &&  (ballY-ballRadius < randomY+50) && (ballY+ballRadius > randomY))){                 
          
        //ballSpeedX = -1 * ballSpeedX
        //ballSpeedY = -1 * ballSpeedY

        
        /*
        if((ballX+ballRadius < randomX+5)  || (ballX-ballRadius > randomX+5) ){
            ballSpeedY = -1 * ballSpeedY
           
        }

        else if((ballY+ballRadius < randomY+5 ) || (ballY-ballRadius > randomY+5) ){
            ballSpeedX = -1 * ballSpeedX
        }
        */
        if((ballX+ballRadius < randomX+5)){
            ballSpeedX = -1 * ballSpeedX
            ballX = ballX -10
        }
        else if((ballY+ballRadius < randomY+5 ) ){
            ballSpeedY = -1 * ballSpeedY
            ballY = ballY-10
        }

        if((ballX-ballRadius > randomX+45)){
            ballSpeedX = -1 * ballSpeedX
            ballX = ballX +10
        }
       

        else if((ballY-ballRadius > randomY+45) ){
            ballSpeedY = -1 * ballSpeedY
            ballY = ballY+10
        }
           
     } 


     if ( obstacles_drawn2 && ((ballX+ballRadius > random2X) &&  (ballX-ballRadius < random2X+60) &&  (ballY-ballRadius < random2Y+60) && (ballY+ballRadius > random2Y))){                 
          
        //ballSpeedX = -1 * ballSpeedX
        //ballSpeedY = -1 * ballSpeedY

        
        /*
        if((ballX+ballRadius < randomX+5)  || (ballX-ballRadius > randomX+5) ){
            ballSpeedY = -1 * ballSpeedY
           
        }

        else if((ballY+ballRadius < randomY+5 ) || (ballY-ballRadius > randomY+5) ){
            ballSpeedX = -1 * ballSpeedX
        }
        */
        if((ballX+ballRadius < random2X+5)){
            ballSpeedX = -1 * ballSpeedX
            ballX = ballX -10
        }
        else if((ballY+ballRadius < random2Y+5 ) ){
            ballSpeedY = -1 * ballSpeedY
            ballY = ballY-10
        }

        if((ballX-ballRadius > random2X+45)){
            ballSpeedX = -1 * ballSpeedX
            ballX = ballX +10
        }
       

        else if((ballY-ballRadius > random2Y+45) ){
            ballSpeedY = -1 * ballSpeedY
            ballY = ballY+10
        }
           
     } 
     
}

// Reset the ball
function resetBall() {

   
    
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;

    move_ball = false;
    setTimeout(()=>{move_ball= true},2000)
   

}

// Check for win condition
function checkWin() {
    if (player1Score === 5) {
        gameOver = true;
        winner = "Player 1 Wins!";
    } else if (player2Score === 5) {
        gameOver = true;
        winner = "Player 2 Wins!";
    }
}

function playPaddleSound() {
    paddleSound.currentTime = 0; 
    paddleSound.play();
}


// W,S I,K
document.addEventListener("keydown", function(event) {
    if (event.keyCode === 87) { // Up arrow
        upPressed = true;
    } else if (event.keyCode === 83) { // Down arrow
        downPressed = true;
    }
});

document.addEventListener("keyup", function(event) {
    if (event.keyCode === 87) { // Up arrow
        upPressed = false;
    } else if (event.keyCode === 83) { // Down arrow
        downPressed = false;
    }
});


document.addEventListener("keydown", function(event) {
    if (event.keyCode === 73) { 
        IPressed = true;
    } else if (event.keyCode === 75) { 
        KPressed = true;
    }
});

document.addEventListener("keyup", function(event) {
    if (event.keyCode === 73) { 
        IPressed = false;
    } else if (event.keyCode === 75) { 
        KPressed = false;
    }
});

// Game loop
function gameLoop() {
    draw();
    if (!gameOver) {
        move();
    }
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();