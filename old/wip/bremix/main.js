var highScore = 0;

// start the game
// start the game
function play() { 
    hideElements();
    playAudio();
    var game = makeGame();
    setUpEventListeners(game);
    var interval = setInterval(function(){draw(game, interval)}, 10);
}

// start the audio
function playAudio() {
    document.getElementById("myAudio").currentTime = 0;
    document.getElementById("myAudio").play();
}

// set up the event listeners
function setUpEventListeners(game) {
    document.addEventListener("keydown", keyDownHandler.bind(null, game), false);
    document.addEventListener("keyup", keyUpHandler.bind(null, game), false);
}

// hide/make visible the appropriate elements
function hideElements() {
    document.getElementById("myCanvas").style.visibility="visible";
    document.getElementById("scoreCount").style.visibility="visible";
    document.getElementById("scoreCount").innerHTML="Score: 0, Speed: 100%";
    document.getElementById("highScoreCount").innerHTML="High score: " + highScore;
    document.getElementById("start").style.display="none";
    document.getElementById("logo").style.display="none";
    document.getElementById("intro").style.display="none";
    document.getElementById("todo").style.display="none";
    document.getElementById("updateLog").style.display="none";
    document.getElementById("audioCreds").style.display="none";
    document.getElementById("disclaimer").style.display="none";
}

// create the game object
function makeGame() {
    var cvs = document.getElementById("myCanvas");
    var game = {
    canvas : cvs,
    ctx : cvs.getContext("2d"),
    paddleHeight : 10,
    paddleWidth : 125,
    paddleX : cvs.width/2,
    x : cvs.width/2,
    y : cvs.height-40,
    dx : 4.0,
    dy : -4.0,
    ballRadius : 10,
    score : 0,
    rightPressed : false,
    leftPressed : false,
    };
    game.ctx.canvas.width = window.innerWidth/2;
    game.ctx.canvas.height = window.innerHeight/2;
    return game;
}

// draw the paddle
function drawPaddle(game) {
    game.ctx.beginPath();
    game.ctx.rect(game.paddleX, game.canvas.height-game.paddleHeight, game.paddleWidth, game.paddleHeight);
    game.ctx.fillStyle="lightblue";
    game.ctx.fill();
    game.ctx.closePath();
}

// draw the ball
function drawBall(game) {
    game.ctx.beginPath();
    game.ctx.arc(game.x, game.y, game.ballRadius, 0, Math.PI*2, false);
    game.ctx.fillStyle="lightblue";
    game.ctx.fill();
    game.ctx.closePath();
}

// main loop
function draw(game, interval, finished) {
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    drawPaddle(game);
    drawBall(game);
    updateGame(game, interval);
}

// make appropriate adjustments to ball/paddle/game
function updateGame(game, interval) {
    // ball hits left or right wall
    leftRightWallCollision(game);
    // ball hits top wall
    topWallCollision(game);
    // ball hits paddle or bottom wall
    botWallCollision(game, interval);
    // move paddle if key pressed
    movePaddle(game);
    // move ball
    game.x += game.dx;
    game.y += game.dy;
}

// see if ball hit left or right wall 
function leftRightWallCollision(game) {
    if (game.x + game.dy <= game.ballRadius || game.x + game.dy > game.canvas.width-game.ballRadius) {
    	game.dx = -game.dx;
    }
}

// see if ball hit top wall
function topWallCollision(game) {
    if (game.y + game.dy < game.ballRadius) {
        game.dy = -game.dy;
    }
}

// see if ball hit paddle or bottom wall
function botWallCollision(game, interval) {
    if (game.y + game.dy > game.canvas.height-game.ballRadius) {
            // hit the paddle--score!
        if (game.x >= game.paddleX && game.x <= game.paddleX + game.paddleWidth) {
            if (game.dx > 0) {
                game.dx += .2;
            } else if (game.dx < 0) {
                game.dx -= .2;
            }
           updateScore(game);
           // hit the bottom wall--game over
        } else {
           endGame(game, interval);
        }
    }
}

// move the paddle if key pressed
function movePaddle(game) {
    if (game.rightPressed && game.paddleX < game.canvas.width-game.paddleWidth) {
        game.paddleX += 10;
    }
    if (game.leftPressed && game.paddleX > 0) {
        game.paddleX -= 10;
    }
}

// update the score accordingly
function updateScore(game) {
    game.score++;
    var currentSpeed = 100 + (game.score * 10);
    var currentScore = "Score: " + game.score + " , Speed: " + currentSpeed + "%";
    document.getElementById("scoreCount").innerHTML=currentScore;
    if (game.score > highScore) {
        highScore = game.score;
    }
    document.getElementById("highScoreCount").innerHTML="High score: " + highScore;
    game.dy = -game.dy -.2;
}

// stop gameplay
function endGame(game, interval) {
    drawEndGameCanvas(game);
    document.getElementById("myAudio").pause();
    clearInterval(interval);
    game.finished = true;       
}

// show the end game screen 
function drawEndGameCanvas(game) {
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    game.ctx.font = "italic 15px Arial";
    game.ctx.fillStyle = "black";
    game.ctx.textAlign = "center";
    var finalMessage = "Oh no! You lost! Your final score: " + game.score + ". Hit enter to play again!";
    wrapText(game.ctx, finalMessage, game.canvas.width/2, game.canvas.height/2, game.canvas.width, 15);
}

// wrap the text in the canvas
function wrapText(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(" ");
        var line = "";
        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + " ";
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;
          if(testWidth > maxWidth) {
            context.fillText(line, x, y);
            line = words[n] + " ";
            y += lineHeight;
          }
          else {
            line = testLine;
          }
        }
        context.fillText(line, x, y);
}

// listen for key presses
function keyDownHandler(game, e) {
    if (e.keyCode === 39) {
        game.rightPressed = true;
    } else if (e.keyCode === 37) {
        game.leftPressed = true;
    }
    if (e.keyCode === 13 && game.finished) {
        game.finished = false;
        play();
    }
}

// listen for key presses
function keyUpHandler(game, e) {
    if (e.keyCode === 39) {
        game.rightPressed = false;
    } else if (e.keyCode === 37) {
        game.leftPressed = false;
    }
}