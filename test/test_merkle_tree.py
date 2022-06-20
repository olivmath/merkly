from merkly import MerkleTree

def test_merkle_tree_constructor():
  tree = MerkleTree([
    "a", "b", "c", "d"
  ])

  assert tree.list == [
    '80084bf2fba02475726feb2cab2d8215eab14bc6bdd8bfb2c8151257032ecd8b',
    'b039179a8a4ce2c252aa6f2f25798251c19b75fc1508d9d511a191e0487d64a7',
    '263ab762270d3b73d3e2cddf9acc893bb6bd41110347e5d5e4bd1d3c128ea90a',
    '4ce8765e720c576f6f5a34ca380b3de5f0912e6e3cc5355542c363891e54594b',
  ]
  "5.189.132.164:7770", "51.195.255.104:7770", "104.248.112.173"