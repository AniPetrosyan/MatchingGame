const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const Game = require("../server/game.js");

describe("Game", function() {
  beforeEach(function() {
    this.game = new Game("testGame");
  });

  afterEach(function() {
    // Runs after each test
  });
  it("Checks that a player is added to the game", function() {
    this.game.addPlayer("userName", 1);
    expect(this.game.players.length).to.be.equal(1);
    expect(this.game.currentPlayer.userName).to.be.equal("userName");
  });

  it("Checks that a third player is not added", function() {
    this.game.addPlayer("testName1", 1);
    this.game.addPlayer("testName2", 1);
    this.game.addPlayer("testName3", 1);
    expect(this.game.players.length).to.be.equal(2);
  });

  it("Check that isTurnOver return true if there are 2 cards", function() {
    sinon.stub(this.game.board, "numFlippedCards").returns(2);
    expect(this.game.isTurnOver()).to.be.equal(true);
  });

  it("Check that game.flipCard calls the the boards flip card method", function() {
    this.game.board.flipCard = sinon.spy();
    this.game.flipCard(2);
    expect(this.game.board.flipCard.called).to.be.equal(true);
  });
});
