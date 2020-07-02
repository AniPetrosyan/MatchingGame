class Card {
  constructor(iconName, id) {
    /**
     * A unique number identifying the card.
     * @type {number}
     */
    this.id = id;

    /**
     * The name of the image for the card.
     * @type {string}
     */
    this.iconName = iconName;

    /**
     * Whether or not the card has been matched.
     * @type {boolean}
     */
    this.isMatched = false;

    /**
     * Whether or not the card has been turned over.
     * @type {boolean}
     */
    this.isTurnedOver = false;
  }

  /**
   * Sets whether the card has been matched.
   */
  matched() {
    this.isMatched = true;
  }

  /**
   * Sets whether the card is turned over.
   * @param {boolean} isTurnedOver True if the card is turned over, false otherwise.
   */
  flip(isTurnedOver) {
    this.isTurnedOver = isTurnedOver;
  }

  /**
   * Gets whether or not the card has been matched.
   * @return {boolean} True if the card has been matched, false otherwise.
   */
  getMatch() {
    return this.isMatched;
  }
}

module.exports = Card;
