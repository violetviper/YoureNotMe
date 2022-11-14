
class Card {
  constructor(numQuestions, questionPack) {
    this.questionList = questionPack.pickRandom(numQuestions);
  }
}

module.exports = Card;
