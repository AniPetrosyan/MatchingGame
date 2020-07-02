class Player {
  constructor(userName, socketId) {
    /**
     * The username of the player.
     * @type {string}
     */
    this.userName = userName;

    /**
     * The socket that the player is connected with.
     * @type {number}
     */
    this.socketId = socketId;

    /**
     * The player's score.
     * @type {number}
     */
    this.score = 0;
  }

  /**
   * Update the players score.
   * @param {*} newPoints The number of points to add to the score
   */
  updateScore(newPoints) {
    this.score += newPoints;
  }

  /**
   * Get the socket id for the player.
   * @return {number} The socket id.
   */
  getSocketId() {
    return this.socketId;
  }
}

module.exports = Player;
