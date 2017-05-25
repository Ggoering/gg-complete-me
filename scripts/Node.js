export default class Node {
  constructor(letter = null, completeWord = false, nextLetters = {}) {
    this.letter = letter
    this.completeWord = completeWord
    this.nextLetters = nextLetters
    this.timesSelected = 0
  }

}
