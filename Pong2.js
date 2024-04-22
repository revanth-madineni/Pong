class PongGame extends netplayjs.Game {
    // In the constructor, we initialize the state of our game.
    constructor() {
        super();

        const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas1"));
       
        //const paddleSound = document.getElementById("paddleSound");
        // Ball properties
        this.ballX = canvas.width / 2;
        this.ballY = canvas.height / 2 ;
        this.ballSpeedX = 3;
        this.ballSpeedY = 3;
        this.ballRadius = 10;

        // Paddle properties
        this.paddleHeight = 100;
        this.paddleWidth = 10;
        this.player1Y = (canvas.height - this.paddleHeight) / 2;
        this.player2Y = (canvas.height - this.paddleHeight) / 2;

        // Score
        this.player1Score = 0;
        this.player2Score = 0;
        this.gameOver = false;
        this.winner = "";

        this.move_ball = true;
    }
  
    // The tick function takes a map of Player -> Input and
    // simulates the game forward. Think of it like making
    // a local multiplayer game with multiple controllers.
    tick(playerInputs) {
      for (const [player, input] of playerInputs.entries()) {
        // Generate player velocity from input keys.
        const vel = input.wasd();
       
        // Apply the velocity to the appropriate player.
        if (player.getID() == 0) {
          //this.player1Y += vel.x * 5;
              if(vel.y > 0 && this.player1Y >0){
                  this.player1Y -= vel.y * 5;
              }
              else if(vel.y < 0 && this.player1Y < 500){
                  this.player1Y -= vel.y * 5;
              }
          
        } else if (player.getID() == 1) {
          //this.bPos.x += vel.x * 5;
              if(vel.y > 0 && this.player2Y >0){
                  this.player2Y -= vel.y * 5;
              }
              else if(vel.y < 0 && this.player2Y < 500){
                  this.player2Y -= vel.y * 5;
              }
             
          
        }
      }

        if(this.move_ball){
            this.ballX += this.ballSpeedX;
            this.ballY += this.ballSpeedY;
        }

        // WALL collisison
        if (this.ballY - this.ballRadius < 0 || this.ballY + this.ballRadius > 600) {
            this.ballSpeedY = -this.ballSpeedY;
        }

        // PADDLES collisison
        if (this.ballX - this.ballRadius < this.paddleWidth) {

            //when hits paddle
            if (this.ballY > this.player1Y && this.ballY < this.player1Y + this.paddleHeight) {
                this.ballSpeedX = -this.ballSpeedX;
                //this.playPaddleSound()

            //they scored
            } else {
                this.player2Score++;

                //setTimeout(resetBall,2000);
                this.resetBall()
                this.checkWin();

            }
        } else if (this.ballX + this.ballRadius > 600 - this.paddleWidth) {
            if (this.ballY > this.player2Y && this.ballY < this.player2Y + this.paddleHeight) {
                this.ballSpeedX = -this.ballSpeedX;
                //this.playPaddleSound()
            } else {
                this.player1Score++;

                //setTimeout(resetBall,2000);
                this.resetBall()

                this.checkWin();
            }
        }
    } //tick ended
   

    // Normally, we have to implement a serialize / deserialize function
    // for our state. However, there is an autoserializer that can handle
    // simple states for us. We don't need to do anything here!
    // serialize() {}
    // deserialize(value) {}
  
    // Draw the state of our game onto a canvas.
    draw(canvas) {
        const ctx = canvas.getContext("2d");

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the ball
        ctx.beginPath();
        ctx.arc(this.ballX, this.ballY, this.ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();

        // Draw the paddles
        ctx.beginPath();
        ctx.rect(0, this.player1Y, this.paddleWidth, this.paddleHeight);
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.rect(canvas.width - this.paddleWidth, this.player2Y, this.paddleWidth, this.paddleHeight);
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.closePath();
    }

    
    

    // Reset the ball
    resetBall() {

    
        
        this.ballX = 300;
        this.ballY = 300;
        this.ballSpeedX = -this.ballSpeedX;

        //this.move_ball = false;
        //setTimeout(()=>{this.move_ball= true},2000)
    

    }

    // Check for win condition
    checkWin() {
        if (this.player1Score === 5) {
            this.gameOver = true;
            this.winner = "Player 1 Wins!";
        } else if (this.player2Score === 5) {
            this.gameOver = true;
            this.winner = "Player 2 Wins!";
        }
    }

    //playPaddleSound() {
        //this.paddleSound.currentTime = 0; 
        //this.paddleSound.play();
    //}

}
  
PongGame.timestep = 1000 / 60; // Our game runs at 60 FPS
PongGame.canvasSize = { width: 600, height: 600 };
  
  // Because our game can be easily rewound, we will use Rollback netcode
  // If your game cannot be rewound, you should use LockstepWrapper instead.
  new netplayjs.RollbackWrapper(PongGame).start();
