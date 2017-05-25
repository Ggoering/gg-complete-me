import fs from 'fs'
import {expect} from 'chai';
import CompleteMe from "../scripts/Complete-Me.js";


describe ('prefix-trie datastructure', () => {
  let completion;

  beforeEach(() => {
    completion = new CompleteMe;
  })
  it ('should have a root which has a null value', () => {
    expect(completion.rootNode.letter).to.equal(null)
  })
  it ('should have a count property', () => {
    expect(completion.count).to.equal(0)
  })
})

describe ('INSERT', () => {
  var completion = new CompleteMe;

  completion.insert("pizza");
  completion.insert("pi")
  it ('It should take in a string and add connecting nodes for each letter in the string', () => {
    expect(completion.rootNode.nextLetters.p.letter).to.equal('p');
    expect(completion.rootNode.nextLetters.p.nextLetters.i.letter).to.equal('i');
    expect(completion.rootNode.nextLetters.p.nextLetters.i.nextLetters.z.letter).to.equal('z');
  })
  it ('value of completeWord should be false if the node is not the last letter of a complete word', () => {
    expect(completion.rootNode.nextLetters.p.nextLetters.i.nextLetters.z.completeWord).to.equal(false);
  })
  it ('should have set the property of completeWord to the word only for the last letter of the string', () => {
    expect(completion.rootNode.nextLetters.p.nextLetters.i.completeWord).to.equal("pi");
  })
})

describe ('COUNT', () => {
  var completion = new CompleteMe;

  it ('Should have a running total of all the added words', () => {

    expect(completion.count).to.equal(0);
    completion.insert("pizza");
    expect(completion.count).to.equal(1);
    completion.insert("piz");
    expect(completion.count).to.equal(2);
    completion.insert("pie");
    expect(completion.count).to.equal(3);
  })

  it ('should have a method that also can count the words', () => {
    let altCount = completion.countWordsBFS();

    expect(altCount).to.equal(3);
  })
})

describe ('SUGGEST_BFS', () => {
  var completion = new CompleteMe;

  it ('Is a breadth first search should produce an array of words whose starting characters match a string', () => {

    completion.insert("pie");
    completion.insert("piz");
    completion.insert("pizza");
    completion.insert("pizzb");
    completion.insert("teflon");
    var suggest1 = completion.suggest("pizz")
    var suggest2 = completion.suggest("piz")

    expect(suggest1).to.deep.equal(["pizza", "pizzb"])
    expect(suggest2).to.deep.equal(["pizza", "pizzb"])
  })
  it ('should not select the word if that word is the input', () => {
    var suggest3 = completion.suggest("pi")

    expect(suggest3).to.deep.equal(["pie", "piz", "pizza", "pizzb"])
  })
})

describe ('SUGGEST_DFS', () => {
  var completion = new CompleteMe;
  
  it ('Is a depth first search && should produce an array of words whose starting characters match a string', () => {

    completion.insert("pi")
    completion.insert("pie");
    completion.insert("piz");
    completion.insert("pizza");
    completion.insert("pizzb");
    completion.insert("teflon");
    var suggest1 = completion.suggestDFS("pizz")
    var suggest2 = completion.suggestDFS("piz")

    expect(suggest1).to.deep.equal(["pizza", "pizzb"])
    expect(suggest2).to.deep.equal(["pizza", "pizzb"])
  })

  it ('should not select the word if that word is the input', () => {
    var suggest3 = completion.suggestDFS("pi")

    expect(suggest3).to.deep.equal(["pie", "piz", "pizza", "pizzb"])
  })
})

describe('POPULATE', () => {
  it('should accept a dataset of words', () => {
    const text = "/usr/share/dict/words";
    var completion = new CompleteMe;
    let dictionary = fs.readFileSync(text).toString().trim().split('\n');

    completion.populate(dictionary)
    expect(completion.count).to.equal(235886)
    var suggest = completion.suggest("piz")

    expect(suggest).to.deep.equal(["pize", "pizza", "pizzle", "pizzeria", "pizzicato"])
    expect(completion.count).to.equal(235886)

    completion.insert("pizza");
    expect(completion.count).to.equal(235886);

    var altCount = completion.countWordsBFS();

    expect(altCount).to.equal(235886)
  })
})

describe('SELECT', () => {
  it('should prioritize more commonly used words', () => {
    const text = "/usr/share/dict/words";
    var completion = new CompleteMe;
    let dictionary = fs.readFileSync(text).toString().trim().split('\n');

    completion.populate(dictionary);

    completion.select('pizzeria');
    var suggest = completion.suggest("piz");

    expect(suggest).to.deep.equal(["pizzeria", "pize", "pizza", "pizzle", "pizzicato"])
  })
})
