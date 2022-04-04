window.onload = function () {
  var canvasWidth = 900;
  var canvasHeight = 600;
  var blockSize = 30;
  var context;
  var delay = 250;
  var snakee;
  var applee;
  var widthInBlocks = canvasWidth / blockSize;
  var heightInBlocks = canvasHeight / blockSize;
  var score;
  var timeout;

  init();

  function init() {
    // création du canvas, du contexte et du serpent initial
    var canvas = document.createElement("canvas"); // = cadre
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border = "30px solid grey";
    canvas.style.margin = "50px auto";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "#ddd";
    document.body.appendChild(canvas);
    context = canvas.getContext("2d"); // = toile
    snakee = new Snake([[6, 4], [5, 4], [4, 4], [3, 4]], "right");
    applee = new Apple([10, 10]);
    score = 0;
    refreshCanvas();
  }

  function refreshCanvas() {
    // effacer le contexte puis redessiner le serpent à sa position
    snakee.advance();
    if (snakee.checkCollision()) {
      gameOver();
    } else {
      if (snakee.isEatingApple(applee)) {
        score++;
        snakee.ateApple = true;
        do {
          applee.setNewPosition();
        } while (applee.isOnSnake(snakee));
      }
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      drawScore();
      snakee.draw();
      applee.draw();
      timeout = setTimeout(refreshCanvas, delay);
    }
  }

  function Snake(body, direction) {
    this.body = body;
    this.direction = direction;
    this.ateApple = false;
    this.draw = function () {
      // dessiner l'ensemble du serpent selon les coordonnées contenues dans body
      context.save();
      context.fillStyle = "#ff0000";
      for (var i = 0; i < this.body.length; i++) {
        drawBlock(context, this.body[i]);
      }
      context.restore();
    };
    this.advance = function () {
      // attribuer une nextPosition au body, pour pouvoir ensuite faire avancer le serpent
      var nextPosition = this.body[0].slice(); // COPIER le bloc [x1,y1]
      switch (
        this.direction // analyser la direction de déplacement actuelle, en déduire la position n+1 et l'attribuer au body
      ) {
        case "left":
          nextPosition[0] -= 1; //nextPosition[0] = x1
          break;

        case "right":
          nextPosition[0] += 1; //
          break;

        case "up":
          nextPosition[1] -= 1; //nextPosition[1] = y1
          break;

        case "down":
          nextPosition[1] += 1;
          break;

        default:
          throw "Invalid direction";
      }
      this.body.unshift(nextPosition);
      if (!this.ateApple) this.body.pop();
      else this.ateApple = false;
    };
    this.setDirection = function (newDirection) {
      var allowedDirections;
      switch (this.direction) {
        case "left":
        case "right":
          allowedDirections = ["up", "down"];
          break;

        case "up":
        case "down":
          allowedDirections = ["left", "right"];
          break;

        default:
          throw "Invalid direction";
      }
      if (allowedDirections.indexOf(newDirection) > -1) {
        // je ne veux changer la direction que si la direction saisie est permise
        this.direction = newDirection;
      }
    };
    this.checkCollision = function () {
      var wallCollision = false;
      var snakeCollision = false;
      var head = this.body[0];
      var rest = this.body.slice(1);
      var snakeX = head[0];
      var snakeY = head[1];
      var minX = 0;
      var minY = 0;
      var maxX = widthInBlocks - 1;
      var maxY = heightInBlocks - 1;
      var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
      var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;
      if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
        wallCollision = true;
      }
      for (var i = 0; i < rest.length; i++) {
        if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
          snakeCollision = true;
        }
      }
      return wallCollision || snakeCollision;
    };
    this.isEatingApple = function (appleToEat) {
      var head = this.body[0];
      if (
        head[0] === appleToEat.position[0] &&
        head[1] === appleToEat.position[1]
      )
        return true;
      else return false;
    };
  }

  function Apple(position) {
    this.position = position;
    this.draw = function () {
      context.save();
      context.fillStyle = "#33cc33";
      context.beginPath();
      var radius = blockSize / 2;
      var x = this.position[0] * blockSize + radius; // abscisse du centre du cercle
      var y = this.position[1] * blockSize + radius; // ordonnée du centre du cercle
      context.arc(x, y, radius, 0, Math.PI * 2, true);
      context.fill();
      context.restore();
    };
    this.setNewPosition = function () {
      var newX = Math.round(Math.random() * (widthInBlocks - 1));
      var newY = Math.round(Math.random() * (heightInBlocks - 1));
      this.position = [newX, newY];
    };
    this.isOnSnake = function (snakeToCheck) {
      var isOnSnake = false;
      for (var i = 0; i < snakeToCheck.body.length; i++) {
        if (
          this.position[0] === snakeToCheck.body[i][0] &&
          this.position[1] === snakeToCheck.body[i][1]
        ) {
          isOnSnake = true;
        }
      }
      return isOnSnake;
    };
  }

  function gameOver() {
    context.save();
    context.font = "bold 70px sans-serif";
    context.fillStyle = "#000";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.strokeStyle = "white"; // couleur du contour
    context.lineWidth = 5; // épaisseur du contour
    var centreX = canvasWidth / 2;
    var centreY = canvasHeight / 2;
    context.strokeText("Game Over", centreX, centreY - 180); // remplissage du contour
    context.fillText("Game Over", centreX, centreY - 180);
    context.font = "bold 30px sans-serif";
    context.strokeText(
      "Appuyer sur la touche Espace pour rejouer",
      centreX,
      centreY - 120
    );
    context.fillText(
      "Appuyer sur la touche Espace pour rejouer",
      centreX,
      centreY - 120
    );
    context.restore();
  }

  function restart() {
    snakee = new Snake([[6, 4], [5, 4], [4, 4], [3, 4]], "right");
    applee = new Apple([10, 10]);
    score = 0;
    clearTimeout(timeout);
    refreshCanvas();
  }

  function drawScore() {
    context.save();
    context.font = "bold 200px sans-serif";
    context.fillStyle = "#bbb"; // grey
    context.textAlign = "center";
    context.textBaseline = "middle";
    var centreX = canvasWidth / 2;
    var centreY = canvasHeight / 2;
    context.fillText(score.toString(), centreX, centreY);
    context.restore();
  }

  function drawBlock(context, position) {
    // dessiner un bloc sur le contexte en fonction de sa position
    var x = position[0] * blockSize;
    var y = position[1] * blockSize;
    context.fillRect(x, y, blockSize, blockSize);
  }

  document.onkeydown = function handleKeydown(e) {
    var key = e.keyCode;
    var newDirection;
    switch (key) {
      case 37:
        newDirection = "left";
        break;
      case 38:
        newDirection = "up";
        break;
      case 39:
        newDirection = "right";
        break;
      case 40:
        newDirection = "down";
        break;
      case 32:
        restart();
        return;
      default:
        return;
    }
    snakee.setDirection(newDirection);
  };
};
