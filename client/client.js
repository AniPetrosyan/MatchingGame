const url = window.location.origin;
let socket = io.connect(url);

var gameName = null;

function sendMessage() {
  var message = document.getElementById("chatMessage").value;
  socket.emit("sendMessage", { gameName, message });
  console.log(message);
}

/**
 * Sends gameName and userName to the server to either create a new game, or
 * join one.
 */
function createOrJoinGame() {
  gameName = document.getElementById("gameName").value;
  var userName = document.getElementById("userName").value;
  console.log({ gameName, userName });
  // Send information to server to create a game.
  socket.emit("createOrJoinGame", { gameName, userName });
  document.getElementById("gameHeader").textContent = gameName;
}

/**
 * Updates whether the user is waiting for an opponent to join their game.
 * @param {boolean} isWaiting
 */
function updateWaiting(isWaiting) {
  var waitingText = document.getElementById("waiting");
  if (isWaiting) {
    waitingText.style.display = "block";
  } else {
    waitingText.style.display = "none";
  }
}

/**
 * Add an icon name to the button's class.
 * @param {Element} btn The button representing a card.
 */
function addIconName(btn) {
  var iconName = btn.getAttribute("iconname");
  btn.classList.add(iconName);
}

/**
 * Remove an icon name from the button's class.
 * @param {Element} btn The button representing a card.
 */
function removeIconName(btn) {
  var iconName = btn.getAttribute("iconname");
  btn.classList.remove(iconName);
}

/**
 * Go through all the cards on the screen and add an icon
 * to all cards that are flipped over or matched.
 * @param {Array<Card>} cards The list of cards to update.
 */
function updateCards(cards) {
  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    var cardDiv = document.getElementById("card" + i);
    var btn = cardDiv.childNodes[0];
    if (card.isMatched) {
      btn.classList.add("matched");
    }
    if (card.isTurnedOver) {
      addIconName(btn);
    } else {
      removeIconName(btn);
    }
  }
}

/**
 * Update the scores of the players.
 * @param {Array<Players>} players A list of players in the game.
 */
function updateScore(players) {
  var playerOnePoints = document.getElementById("playerOnePoints");
  var playerTwoPoints = document.getElementById("playerTwoPoints");
  playerOnePoints.textContent = players[0].score;
  playerTwoPoints.textContent = players[1].score;
}

/**
 * Update the game board to display what cards have been turned over, user scores
 * and matched cards.
 * @param {Object} game The game board
 */
function updateGameBoard(game) {
  updateCards(game.board.cards);
  updateScore(game.players);
}

/**
 * Hide the div that allows users to create a game.
 */
function hideCreateGame() {
  var createGameDiv = document.getElementById("createGame");
  createGameDiv.style.display = "none";
}

/**
 * Create the UI for a game board.
 * TODO: Should update this to be completely dynamically created.
 * @param {Object} game The game board.
 */
function createGameBoard(game) {
  var cards = game.board.cards;
  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    var button = document.createElement("button");
    button.classList.add("card");
    button.classList.add("fa");
    button.setAttribute("iconname", card.iconName);
    button.setAttribute("cardId", card.id);
    button.onclick = onBtnClick;
    var cardDiv = document.getElementById("card" + i);
    cardDiv.appendChild(button);
  }
}

function showChatArea() {
  var chatBox = document.getElementById("chatBox");
  chatBox.style.display = "block";
}

/**
 * Callback for when a card is clicked.
 */
function onBtnClick(e) {
  console.log(e);
  var btnDiv = e.srcElement;
  var cardId = btnDiv.getAttribute("cardId");
  console.log(cardId);
  socket.emit("cardPicked", { gameName, cardId });
  // Turn around the card/Show the icon on the card
  // send id of the card and the game name
  // Wait for another card to be pressed
  // TODO:Send over the cardId when the button is clicked.
}

/**
 * Change the color of the page in order to show that it is someone
 * elses turn.
 */
function changeTurns() {
  var body = document.getElementsByTagName("body")[0];
  var bodyColor = body.style.backgroundColor;
  var newColor = bodyColor === "pink" ? "limegreen" : "pink";
  body.style.backgroundColor = newColor;
}

/**
 * Display the name of the player that won the game.
 * @param {Player} player The player that won the game.
 */
function showWinner(player) {
  var gameBoard = document.getElementById("gameBoard");
  var winningDiv = document.getElementById("winner");

  if (player) {
    gameBoard.style.display = "none";
    winningDiv.style.display = "block";
    winningDiv.textContent = "The winner is: " + player.userName;
  } else {
    gameBoard.style.display = "block";
    winningDiv.style.display = "none";
  }
}

function test() {
  // createGameBoard(game);
  // hideCreateGame();
  // updateGameBoard(game);
  // changeTurns();
  // showWinner(game.currentPlayer);
}

socket.on("startGame", function(game) {
  console.log("Client: startGame");
  // Hide our current screen
  showChatArea();
  updateWaiting(false);
  hideCreateGame();
  createGameBoard(game);
  updateGameBoard(game);
});

socket.on("waiting", function() {
  console.log("Client: Waiting");
  updateWaiting(true);
});

socket.on("cardPicked", function(game) {
  console.log("Client: Card Picked");
  updateGameBoard(game);
});

socket.on("newTurn", function(game) {
  console.log("Client: New Turn");
  updateGameBoard(game);
  changeTurns();
});

socket.on("notTurn", function(game) {
  console.log("Client: Not Your Turn");
  updateGameBoard(game);
});

socket.on("winner", function(player) {
  console.log("Client: Winner");
  showWinner(player);
});

socket.on("msgReceived", function(message) {
  console.log(message);
  var msgDiv = document.getElementById("receivedMessages");
  var newMessageDiv = document.createElement("div");
  newMessageDiv.textContent = message;
  msgDiv.appendChild(newMessageDiv);
});
