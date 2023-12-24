const { MerkleTree } = require('merkletreejs');
const SHA256 = require('crypto-js/sha256');

const leaves = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(x => SHA256(x));
const tree = new MerkleTree(leaves, SHA256);
const leaf = SHA256('a');
const proof = tree.getProof(leaf).map(node => ({ data: node.data.toString('hex'), position: node.position }));

console.log(JSON.stringify({ proof, isValid: tree.verify(proof, leaf, tree.getRoot()) }))
