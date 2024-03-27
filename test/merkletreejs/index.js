const { MerkleTree } = require('merkletreejs')
const web3 = require("web3")
const SHA256 = require('crypto-js/sha256')


// const keccak = (data) => web3.utils.keccak256(data)


const leaves = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map(SHA256)
const tree = new MerkleTree(leaves, SHA256, {})
const root = tree.getRoot().toString('hex')

// console.log(leaves)
console.log(root)

