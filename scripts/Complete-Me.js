import Node from "../scripts/Node.js";

export default class CompleteMe {

  constructor() {
    this.count = 0
    this.rootNode = new Node()
  }

  insert(word) {
    let currentNode = this.rootNode;

    // if node already exists, don't create duplicate
    for (let i = 0; i < word.length; i++) {
      if (currentNode.nextLetters[word[i]]) {
        currentNode = currentNode.nextLetters[word[i]];
        // use existing node and identify it as complete word, only if it isn't already
        if (i === word.length - 1 && !currentNode.completeWord) {
          currentNode.completeWord = word
          this.count++
        }
        // if node doesn't exist yet, create nodes until the last letter is reached
      } else {
        currentNode.nextLetters[word[i]] = new Node(word[i]);
        currentNode = currentNode.nextLetters[word[i]]
        // once we're at the last letter we know we have a new complete word
        if (i === word.length - 1) {
          currentNode.completeWord = word
          this.count++
        }
      }
    }
  }

  suggest(input) {
    let returnedWords = [];
    let queue = []
    let returnLimit = 10
    // find prefix node
    let currentNode = this.findNode(input, this.rootNode)

    // find children
    let queueKeys = Object.keys(currentNode.nextLetters);

    for (let i = 0; i < queueKeys.length; i++) {
      queue.push(currentNode.nextLetters[queueKeys[i]])
    }

    while (returnedWords.length < returnLimit && queue.length) {
      if (queue[0].completeWord) {
        returnedWords.push(queue[0])
      }
      let queueKeys = Object.keys(queue[0].nextLetters);

      for (let i = 0; i < queueKeys.length; i++) {
        queue.push(queue[0].nextLetters[queueKeys[i]])
      }
      queue.shift()
    }
    // Sort by the timesSelected value
    return this.sortFrequentlyUsedWords(returnedWords)
  }

  populate(text) {
    let i = 0;

    while (i < text.length) {
      this.insert(text[i]);
      i++;
    }
  }

  select(word) {
    let currentNode = this.rootNode;

    for (let i = 0; i < word.length; i++) {
      currentNode = currentNode.nextLetters[word[i]];

      if (i === word.length - 1) {
        currentNode.timesSelected++
      }
    }
  }

// Helper functions

  findNode(input, currentNode) {
    for (let i = 0; i < input.length; i++) {
      currentNode = currentNode.nextLetters[input[i]]
    }
    return currentNode;
  }

  sortFrequentlyUsedWords(returnedWords) {
    returnedWords.sort(function(a, b) {
      return b.timesSelected - a.timesSelected
    })

    let displayWords = returnedWords.reduce(function(accu, nodeObj) {

      accu.push(nodeObj.completeWord);
      return accu;
    }, [])
    return displayWords;
  }

  //No recursion
  countWordsBFS() {
    let currentNode = this.rootNode;
    let count = 0;
    let queue = [];
    let queueKeys = Object.keys(currentNode.nextLetters);

    //initialize queue
    for (let i = 0; i < queueKeys.length; i++) {
      queue.push(currentNode.nextLetters[queueKeys[i]])
      // as soon as we push the next root node into queue it runs through all the children
      while (queue.length) {
        if (queue[0].completeWord) {
          count++
        }
        let queueKeys = Object.keys(queue[0].nextLetters);

        for (let i = 0; i < queueKeys.length; i++) {
          queue.push(queue[0].nextLetters[queueKeys[i]])
        }
        queue.shift()
      }
    }
    return count
  }

  suggestDFS(input) {
    var resultsArray = []
    let currentNode = this.findNode(input, this.rootNode);
    let nextLettersArray = Object.keys(currentNode.nextLetters);

    for (let i = 0; i < nextLettersArray.length; i++) {
      this.nodeSpelunker(input, currentNode.nextLetters[nextLettersArray[i]], resultsArray)
    }
    return this.sortResults(resultsArray);
  }

  nodeSpelunker(input, currentNode, resultsArray) {
    input += currentNode.letter
    let nextLettersArray = Object.keys(currentNode.nextLetters);

    if (!nextLettersArray.length) {
      resultsArray.push({word: input,
        frequency: currentNode.timesSelected})
      return input
    }
    if (currentNode.completeWord) {
      resultsArray.push({word: input,
        frequency: currentNode.timesSelected})
    }
    for (let i = 0; i < nextLettersArray.length; i++) {
      this.nodeSpelunker(input, currentNode.nextLetters[nextLettersArray[i]], resultsArray)
    }
  }

  sortResults(resultsArray) {
    resultsArray.sort(function(a, b) {
      return b.frequency - a.frequency
    })
    var outputArray = resultsArray.reduce(function(accu, element) {

      accu.push(element.word);
      return accu;
    }, [])
    return outputArray
  }

}
