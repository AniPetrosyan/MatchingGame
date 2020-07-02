var Player = require("./player.js");
var Board = require("./board.js");

class Game {
  constructor(name) {
    /**
     * The name of the game
     * @type {string}
     */
    this.name = name;

    /**
     * The list of players in the game.
     * @type {Array<Player>}
     */
    this.players = [];

    /**
     * The player whose turn it is.
     * @type {Player}
     */
    this.currentPlayer = null;

    /**
     * The game board that holds all the cards.
     * @type {Board}
     */
    this.board = new Board(12);
  }

  /**
   * Add a player to the game. If the player is the first
   * player then make them the current player.
   * @param {string} userName The username of the new player.
   * @param {number} socketId The socket id of the new player.
   * @return {number} The number of players in the game.
   */
  addPlayer(userName, socketId) {
    if (this.players.length == 2) {
      return this.players.length;
    }
    // Create the player
    const newPlayer = new Player(userName, socketId);
    // Check if it is the first player added
    if (this.players.length == 0) {
      this.setCurrentPlayer(newPlayer);
    }
    // Add player to list of players.
    this.players.push(newPlayer);
    return this.players.length;
  }

  /**
   * Set the player who is currently taking their turn.
   * @param {Player} player The player whose turn it is.
   */
  setCurrentPlayer(player) {
    this.currentPlayer = player;
  }

  /**
   * Get the player whose turn it is.
   * @return {Player} The player whose turn it is.
   */
  getCurrentPlayer() {
    return this.currentPlayer;
  }

  /**
   * Updates the card with the given id's turned over value.
   * @param {number} cardId The id of the card that has been flipped over.
   *
   */
  flipCard(cardId) {
    this.board.flipCard(cardId);
  }

  /**
   * Checks whether the current turn is over.
   * @return {boolean} True if the current player has chosen 2 cards, false otherwise.
   */
  isTurnOver() {
    return this.board.numFlippedCards() === 2;
  }

  /**
   * Ends the players turn and switches to the next player.
   */
  endPlayerTurn() {
    if (this.board.checkForMatch()) {
      this.currentPlayer.updateScore(10);
    }
    this.switchTurns();
  }

  /**
   * Resets all values necessary to start a new player's turn.
   */
  switchTurns() {
    this.board.resetCards();
    var indexOfCurrentPlayer = this.players.indexOf(this.currentPlayer);
    var newIdx = indexOfCurrentPlayer === 0 ? 1 : 0;
    this.currentPlayer = this.players[newIdx];
  }

  /**
   * Returns whether or not the game is over.
   * @return {boolean} True if the game is over, false otherwise.
   */
  isOver() {
    return this.board.cardsMatched();
  }
}
module.exports = Game;
