var Card = require("./card.js");

class Board {
  constructor(numCards) {
    /**
     * The cards in the game.
     * @type {Array<Card>}
     */
    this.cards = this.createCards(numCards, false);

    /**
     * The list of cards that have been flipped over.
     * @type {Array<Card>}
     */
    this.flippedCards = [];
  }

  /**
   * Create a list of cards for the game.
   * @param {number} numCards The number of cards in the game.
   * @return {Array<Card>} The list of cards for the game.
   */
  createCards(numCards, shuffle) {
    var iconNames = [
      "fa-bath",
      "fa-meetup",
      "fa-superpowers",
      "fa-thermometer-quarter",
      "fa-car",
      "fa-camera-retro"
    ];
    var cards = [];
    for (var i = 0; i < numCards; i += 2) {
      var cardOne = new Card(iconNames[i / 2], i);
      var cardTwo = new Card(iconNames[i / 2], i + 1);
      cards.push(cardOne);
      cards.push(cardTwo);
    }
    if (shuffle) {
      cards = this.shuffleCards(cards);
    }
    return cards;
  }

  shuffleCards(cards) {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = cards[i];
      cards[i] = cards[j];
      cards[j] = temp;
    }
    return cards;
  }

  /**
   * Gets the number of cards flipped over on the board.
   * @return {number} The number of cards flipped over.
   */
  numFlippedCards() {
    console.log("HERE");
    return this.flippedCards.length;
  }

  /**
   * Resets the list of cards.
   */
  resetCards() {
    this.flippedCards = [];
  }

  /**
   * Checks the two cards flipped over to see if they are a match.
   * @return {boolean} True if the cards are a match, false otherwise.
   */
  checkForMatch() {
    if (this.numFlippedCards() != 2) {
      return false;
    }
    var cardOne = this.flippedCards[0];
    var cardTwo = this.flippedCards[1];
    if (cardOne.iconName === cardTwo.iconName) {
      cardOne.matched();
      cardTwo.matched();
      return true;
    } else {
      cardOne.flip(false);
      cardTwo.flip(false);
      return false;
    }
  }

  /**
   * Gets the card with the given id.
   * @return {Card} The card with the given id or null if no card exists.
   */
  getCardById(cardId) {
    for (var i = 0; i < this.cards.length; i++) {
      var card = this.cards[i];
      if (card.id == cardId) {
        console.log("Are we in card.id == card");
        return card;
      }
    }
    return null;
  }

  /**
   * Updates the given card to be flipped over.
   * @param {number} cardId The id of the card to flip over.
   */
  flipCard(cardId) {
    console.log("Card ID: ", cardId);
    var card = this.getCardById(cardId);
    console.log("Card", card);
    card.flip(true);
    this.flippedCards.push(card);
  }

  /**
   * Checks whether all the cards have found their match.
   * @return {boolean} True if all cards have found their match, false otherwise.
   */
  cardsMatched() {
    for (var i = 0; i < this.cards.length; i++) {
      var card = this.cards[i];
      if (!card.getMatch()) {
        return false;
      }
    }
    return true;
  }
}

module.exports = Board;
