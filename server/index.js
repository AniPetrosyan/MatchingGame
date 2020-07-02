const http = require("http"),
  express = require("express"),
  app = express(),
  socketIo = require("socket.io");
const fs = require("fs");
const Game = require("./game.js");

const server = http.Server(app).listen(8080);
const io = socketIo(server);
const games = {};

app.use(express.static(__dirname + "/../client/"));
app.use(express.static(__dirname + "/../node_modules/"));

app.get("/", (req, res) => {
  // res.sendFile("index.html", { root: __dirname + "/../client" });
  const stream = fs.createReadStream(__dirname + "/../client/index.html");
  stream.pipe(res);
});

function getGame(gameName) {
  var game = null;
  if (games[gameName]) {
    game = games[gameName];
  } else {
    game = new Game(gameName);
    games[gameName] = game;
  }
  return game;
}

// Add the WebSocket handlers
io.on("connection", function(socket) {
  socket.on("createOrJoinGame", function({ gameName, userName }) {
    console.log("Server: Create or Join Game");
    var game = getGame(gameName);
    // Add a player to game
    var numPlayers = game.addPlayer(userName, socket.id);

    socket.join(gameName);
    if (numPlayers === 2) {
      io.sockets.in(gameName).emit("startGame", game);
    } else if (numPlayers < 2) {
      socket.emit("waiting");
    } else {
      socket.emit("startGame", game);
    }
  });

  socket.on("cardPicked", function({ gameName, cardId }) {
    var game = getGame(gameName);
    console.log("Server: In card Picked");
    console.log(game);
    var currentPlayer = game.getCurrentPlayer();
    console.log(currentPlayer);
    if (socket.id === currentPlayer.getSocketId()) {
      game.flipCard(cardId);
      io.sockets.in(gameName).emit("cardPicked", game);
      if (game.isTurnOver()) {
        game.endPlayerTurn();
        setTimeout(function() {
          io.sockets.in(gameName).emit("newTurn", game);
        }, 500);
      }
      if (game.isOver()) {
        io.sockets.in(gameName).emit("winner", game.getCurrentPlayer());
      }
      // Check whether the icons match
      // Update the score
      // Tell the client that it's a new persons turn
    }
  });

  socket.on("sendMessage", function({ gameName, message }) {
    console.log(message);
    io.sockets.in(gameName).emit("msgReceived", message);
  });
});
