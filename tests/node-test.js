import Node from "../scripts/Node.js";
import {expect} from 'chai';

describe ('It is a node in a prefix-trie datastructure', () => {
  let node;

  beforeEach( () => {
    node = new Node()
  })

  it ('should be an object', () => {
    expect(node).be.object;
  })

  it ('should have a value of null by default', () => {
    expect(node.letter).to.equal(null)
  })
  it ('should have property completeWord', () => {
    expect(node).to.have.property('completeWord')
  })
  it ('should have property timesSelected', () => {
    expect(node).to.have.property('timesSelected')
  })
  it ('should be able to link to following nodes', () => {
    var node2 = new Node('a', true, {t: "t"})

    expect(node2.nextLetters).to.deep.equal({t: "t"})
  })
})
