import { Buffer } from 'buffer'
import CryptoJS from 'crypto-js'

export class Base {
  /**
   * print
   * @desc Prints out a visual representation of the merkle tree.
   * @example
   *```js
   *tree.print()
   *```
   */
  print (): void {
    Base.print(this)
  }

  /**
   * bufferIndexOf
   * @desc Returns the first index of which given buffer is found in array.
   * @param {Buffer[]} haystack - Array of buffers.
   * @param {Buffer} needle - Buffer to find.
   * @return {Number} - Index number
   *
   * @example
   * ```js
   *const index = tree.bufferIndexOf(haystack, needle)
   *```
   */
  protected bufferIndexOf (
    array: Buffer[],
    element: Buffer,
    isSorted: boolean = false
  ): number {
    if (isSorted) {
      return this.binarySearch(array, element, Buffer.compare)
    }

    const eqChecker = (buffer1, buffer2) => buffer1.equals(buffer2)
    return this.linearSearch(array, element, eqChecker)
  }

  /**
   * binarySearch
   * @desc Returns the first index of which given item is found in array using binary search.
   * @param {Buffer[]} array - Array of items.
   * @param {Buffer} element - Item to find.
   * @param {Function} compareFunction
   * @return {Number} - Index number
   *
   * @example
   * ```js
   *const index = MerkleTree.binarySearch(array, element, Buffer.compare)
   *```
   */
  static binarySearch (
    array: Buffer[],
    element: Buffer,
    compareFunction: (a: unknown, b: unknown) => number
  ): number {
    let start = 0
    let end = array.length - 1

    // Iterate while start not meets end
    while (start <= end) {
      // Find the mid index
      const mid = Math.floor((start + end) / 2)

      // Check if the mid value is greater than, equal to, or less than search element.
      const ordering = compareFunction(array[mid], element)

      // If element is present at mid, start iterating for searching first appearance.
      if (ordering === 0) {
        // Linear reverse iteration until the first matching item index is found.
        for (let i = mid - 1; i >= 0; i--) {
          if (compareFunction(array[i], element) === 0) continue
          return i + 1
        }
        return 0
      } /* Else look in left or right half accordingly */ else if (ordering < 0) {
        start = mid + 1
      } else {
        end = mid - 1
      }
    }

    return -1
  }

  /**
   * binarySearch
   * @desc Returns the first index of which given item is found in array using binary search.
   * @param {Buffer[]} array - Array of items.
   * @param {Buffer} element - Item to find.
   * @param {Function} compareFunction
   * @return {Number} - Index number
   *
   * @example
   * ```js
   *const index = tree.binarySearch(array, element, Buffer.compare)
   *```
   */
  binarySearch (
    array: Buffer[],
    element: Buffer,
    compareFunction: (a: unknown, b: unknown) => number
  ): number {
    return Base.binarySearch(array, element, compareFunction)
  }

  /**
   * linearSearch
   * @desc Returns the first index of which given item is found in array using linear search.
   * @param {Buffer[]} array - Array of items.
   * @param {Buffer} element - Item to find.
   * @param {Function} eqChecker
   * @return {Number} - Index number
   *
   * @example
   * ```js
   *const index = MerkleTree.linearSearch(array, element, (a, b) => a === b)
   *```
   */
  static linearSearch (array: Buffer[], element: Buffer, eqChecker: (a: unknown, b: unknown) => boolean):number {
    for (let i = 0; i < array.length; i++) {
      if (eqChecker(array[i], element)) {
        return i
      }
    }

    return -1
  }

  /**
   * linearSearch
   * @desc Returns the first index of which given item is found in array using linear search.
   * @param {Buffer[]} array - Array of items.
   * @param {Buffer} element - Item to find.
   * @param {Function} eqChecker
   * @return {Number} - Index number
   *
   * @example
   * ```js
   *const index = tree.linearSearch(array, element, (a, b) => a === b)
   *```
   */
  linearSearch (array: Buffer[], element: Buffer, eqChecker: (a: unknown, b: unknown) => boolean):number {
    return Base.linearSearch(array, element, eqChecker)
  }

  /**
   * bufferify
   * @desc Returns a buffer type for the given value.
   * @param {String|Number|Object|Buffer|ArrayBuffer} value
   * @return {Buffer}
   *
   * @example
   * ```js
   *const buf = MerkleTree.bufferify('0x1234')
   *```
   */
  static bufferify (value: any): Buffer {
    if (!Buffer.isBuffer(value)) {
      // crypto-js support
      if (typeof value === 'object' && value.words) {
        return Buffer.from(value.toString(CryptoJS.enc.Hex), 'hex')
      } else if (Base.isHexString(value)) {
        return Buffer.from(value.replace(/^0x/, ''), 'hex')
      } else if (typeof value === 'string') {
        return Buffer.from(value)
      } else if (typeof value === 'bigint') {
        return Buffer.from(value.toString(16), 'hex')
      } else if (value instanceof Uint8Array) {
        return Buffer.from(value.buffer)
      } else if (typeof value === 'number') {
        let s = value.toString()
        if (s.length % 2) {
          s = `0${s}`
        }
        return Buffer.from(s, 'hex')
      } else if (ArrayBuffer.isView(value)) {
        return Buffer.from(value.buffer, value.byteOffset, value.byteLength)
      }
    }

    return value
  }

  bigNumberify (value: any): BigInt {
    return Base.bigNumberify(value)
  }

  static bigNumberify (value: any): BigInt {
    if (typeof value === 'bigint') {
      return value
    }

    if (typeof value === 'string') {
      if (value.startsWith('0x') && Base.isHexString(value)) {
        return BigInt('0x' + value.replace('0x', '').toString())
      }
      return BigInt(value)
    }

    if (Buffer.isBuffer(value)) {
      return BigInt('0x' + value.toString('hex'))
    }

    if (value instanceof Uint8Array) {
      return BigInt(value)
    }

    if (typeof value === 'number') {
      return BigInt(value)
    }

    throw new Error('cannot bigNumberify')
  }

  /**
   * isHexString
   * @desc Returns true if value is a hex string.
   * @param {String} value
   * @return {Boolean}
   *
   * @example
   * ```js
   *console.log(MerkleTree.isHexString('0x1234'))
   *```
   */
  static isHexString (v: string): boolean {
    return typeof v === 'string' && /^(0x)?[0-9A-Fa-f]*$/.test(v)
  }

  /**
   * print
   * @desc Prints out a visual representation of the given merkle tree.
   * @param {Object} tree - Merkle tree instance.
   * @return {String}
   * @example
   *```js
   *MerkleTree.print(tree)
   *```
   */
  static print (tree: any): void {
    console.log(tree.toString())
  }

  /**
   * bufferToHex
   * @desc Returns a hex string with 0x prefix for given buffer.
   * @param {Buffer} value
   * @return {String}
   * @example
   *```js
   *const hexStr = tree.bufferToHex(Buffer.from('A'))
   *```
   */
  bufferToHex (value: Buffer, withPrefix: boolean = true): string {
    return Base.bufferToHex(value, withPrefix)
  }

  /**
   * bufferToHex
   * @desc Returns a hex string with 0x prefix for given buffer.
   * @param {Buffer} value
   * @return {String}
   * @example
   *```js
   *const hexStr = MerkleTree.bufferToHex(Buffer.from('A'))
   *```
   */
  static bufferToHex (value: Buffer, withPrefix: boolean = true): string {
    return `${withPrefix ? '0x' : ''}${(value || Buffer.alloc(0)).toString(
      'hex'
    )}`
  }

  /**
   * bufferify
   * @desc Returns a buffer type for the given value.
   * @param {String|Number|Object|Buffer} value
   * @return {Buffer}
   *
   * @example
   * ```js
   *const buf = tree.bufferify('0x1234')
   *```
   */
  bufferify (value: any): Buffer {
    return Base.bufferify(value)
  }

  /**
   * bufferifyFn
   * @desc Returns a function that will bufferify the return value.
   * @param {Function}
   * @return {Function}
   *
   * @example
   * ```js
   *const fn = tree.bufferifyFn((value) => sha256(value))
   *```
   */
  bufferifyFn (f: any): any {
    return (value: any): Buffer => {
      const v = f(value)
      if (Buffer.isBuffer(v)) {
        return v
      }

      if (this.isHexString(v)) {
        return Buffer.from(v.replace('0x', ''), 'hex')
      }

      if (typeof v === 'string') {
        return Buffer.from(v)
      }

      if (typeof v === 'bigint') {
        return Buffer.from(value.toString(16), 'hex')
      }

      if (ArrayBuffer.isView(v)) {
        return Buffer.from(v.buffer, v.byteOffset, v.byteLength)
      }

      // crypto-js support
      return Buffer.from(
        f(CryptoJS.enc.Hex.parse(value.toString('hex'))).toString(
          CryptoJS.enc.Hex
        ),
        'hex'
      )
    }
  }

  /**
   * isHexString
   * @desc Returns true if value is a hex string.
   * @param {String} value
   * @return {Boolean}
   *
   * @example
   * ```js
   *console.log(MerkleTree.isHexString('0x1234'))
   *```
   */
  protected isHexString (value: string): boolean {
    return Base.isHexString(value)
  }

  /**
   * log2
   * @desc Returns the log2 of number.
   * @param {Number} value
   * @return {Number}
   */
  protected log2 (n: number): number {
    return n === 1 ? 0 : 1 + this.log2((n / 2) | 0)
  }

  /**
   * zip
   * @desc Returns true if value is a hex string.
   * @param {String[]|Number[]|Buffer[]} a - first array
   * @param {String[]|Number[]|Buffer[]} b -  second array
   * @return {String[][]|Number[][]|Buffer[][]}
   *
   * @example
   * ```js
   *const zipped = tree.zip(['a', 'b'],['A', 'B'])
   *console.log(zipped) // [ [ 'a', 'A' ], [ 'b', 'B' ] ]
   *```
   */
  protected zip (a: any[], b: any[]): any[][] {
    return a.map((e, i) => [e, b[i]])
  }

  static hexZeroPad (hexStr: string, length: number) {
    return '0x' + hexStr.replace('0x', '').padStart(length, '0')
  }
}



import Base from './Base'
import treeify from 'treeify'

export interface Options {
  depth?: number
  // how many inputs per node
  arity?: number
  zeroValue?: any
}

export class IncrementalMerkleTree extends Base {
  private depth?: number
  private arity?: number
  private zeroes?: any[]
  private root?: any
  private nodes?: any[]
  private hashFn: any
  private zeroValue: any

  constructor (hashFn: any, options: Options) {
    super()
    this.hashFn = hashFn
    if (options.depth) {
      this.depth = options.depth
    }
    if (options.arity) {
      this.arity = options.arity
    }

    if (this.depth < 1) {
      throw new Error('depth must be greater than 0')
    }

    if (this.arity < 1) {
      throw new Error('arity must be greater than 0')
    }

    const nodes = []
    let zeroValue = options.zeroValue
    this.zeroValue = zeroValue
    this.zeroes = []
    if (this.depth) {
      for (let i = 0; i < this.depth; i++) {
        this.zeroes.push(zeroValue)
        nodes[i] = []
        zeroValue = this.hashFn(Array(this.arity).fill(zeroValue))
      }
    }

    this.nodes = nodes
    this.root = zeroValue
  }

  getRoot () {
    return this.root
  }

  getHexRoot () {
    return this.bufferToHex(this.bufferify(this.getRoot()))
  }

  insert (leaf: any) {
    if (this.depth && this.arity) {
      if (this.nodes[0].length >= this.getMaxLeaves()) {
        throw new Error('tree is full')
      }
    }

    let node = leaf
    let index = this.nodes[0].length

    for (let level = 0; level < this.depth; level += 1) {
      const position = index % this.arity
      const levelStartIndex = index - position
      const levelEndIndex = levelStartIndex + this.arity

      const children = []
      this.nodes[level][index] = node

      for (let i = levelStartIndex; i < levelEndIndex; i += 1) {
        if (i < this.nodes[level].length) {
          children.push(this.nodes[level][i])
        } else {
          children.push(this.zeroes[level])
        }
      }

      node = this.hashFn(children)
      index = Math.floor(index / this.arity)
    }

    this.root = node
  }

  delete (index: number) {
    this.update(index, this.zeroValue)
  }

  update (index: number, newLeaf: any) {
    if (index < 0 || index >= this.nodes[0].length) {
      throw new Error('out of bounds')
    }

    let node = newLeaf

    for (let level = 0; level < this.depth; level += 1) {
      const position = index % this.arity
      const levelStartIndex = index - position
      const levelEndIndex = levelStartIndex + this.arity

      const children = []
      this.nodes[level][index] = node

      for (let i = levelStartIndex; i < levelEndIndex; i += 1) {
        if (i < this.nodes[level].length) {
          children.push(this.nodes[level][i])
        } else {
          children.push(this.zeroes[level])
        }
      }

      node = this.hashFn(children)
      index = Math.floor(index / this.arity)
    }

    this.root = node
  }

  getDepth (): number {
    return this.depth
  }

  getArity (): number {
    return this.arity
  }

  getMaxLeaves (): number {
    return this.depth ** this.arity
  }

  indexOf (leaf: any): number {
    return this.nodes[0].indexOf(leaf)
  }

  getLeaves () {
    const leaves = this.copyList(this.nodes[0])
    const index = this.nodes[0].length
    for (let i = index; i < this.getMaxLeaves(); i++) {
      leaves[i] = this.zeroValue
    }
    return leaves
  }

  copyList (list: any[]) {
    return list.map((x: any) => BigInt(x))
  }

  getLayers ():any[] {
    const layers = []

    for (const list of this.nodes) {
      layers.push(this.copyList(list))
    }

    if (layers[0].length < this.getMaxLeaves()) {
      let index = layers[0].length
      for (let i = index; i < this.getMaxLeaves(); i++) {
        layers[0][i] = this.zeroValue
      }
      for (let level = 0; level < this.depth; level++) {
        const position = index % this.arity
        const levelStartIndex = index - position
        const levelEndIndex = levelStartIndex + this.arity

        for (let i = levelStartIndex; i < levelEndIndex; i++) {
          if (i >= layers[level].length) {
            layers[level][i] = this.zeroes[level]
          }
        }
        index = Math.floor(index / this.arity)
      }
    }

    layers.push([this.root])
    return layers
  }

  getHexLayers ():string[] {
    return this.getLayers().reduce((acc: string[][], item: Buffer[]) => {
      if (Array.isArray(item)) {
        acc.push(item.map(layer => this.bufferToHex(this.bufferify(layer))))
      } else {
        acc.push(item)
      }

      return acc
    }, [])
  }

  getLayersAsObject ():any {
    const layers: any[] = this.getLayers().map((layer: any) => layer.map((value: any) => this.bufferToHex(this.bufferify(value), false)))
    const objs = []
    for (let i = 0; i < layers.length; i++) {
      const arr = []
      for (let j = 0; j < layers[i].length; j++) {
        const obj = { [layers[i][j]]: null }
        if (objs.length) {
          obj[layers[i][j]] = {}
          const a = objs.shift()
          const akey = Object.keys(a)[0]
          obj[layers[i][j]][akey] = a[akey]
          if (objs.length) {
            const b = objs.shift()
            const bkey = Object.keys(b)[0]
            obj[layers[i][j]][bkey] = b[bkey]
          }
        }

        arr.push(obj)
      }

      objs.push(...arr)
    }

    return objs[0]
  }

  computeRoot () {
    let node : any
    let index = this.nodes[0].length
    for (let level = 0; level < this.depth; level += 1) {
      const position = index % this.arity
      const levelStartIndex = index - position
      const levelEndIndex = levelStartIndex + this.arity

      const children = []

      for (let i = levelStartIndex; i < levelEndIndex; i += 1) {
        if (i < this.nodes[level].length) {
          children.push(this.nodes[level][i])
        } else {
          children.push(this.zeroes[level])
        }
      }

      node = this.hashFn(children)
      index = Math.floor(index / this.arity)
    }

    return node
  }

  getProof (index: number): any {
    if (index < 0 || index >= this.nodes[0].length) {
      throw new Error('The leaf does not exist in this tree')
    }

    const siblings: Node[][] = []
    const pathIndices: number[] = []
    const leafIndex = index

    for (let level = 0; level < this.depth; level += 1) {
      const position = index % this.arity
      const levelStartIndex = index - position
      const levelEndIndex = levelStartIndex + this.arity

      pathIndices[level] = position
      siblings[level] = []

      for (let i = levelStartIndex; i < levelEndIndex; i += 1) {
        if (i !== index) {
          if (i < this.nodes[level].length) {
            siblings[level].push(this.nodes[level][i])
          } else {
            siblings[level].push(this.zeroes[level])
          }
        }
      }

      index = Math.floor(index / this.arity)
    }

    return { root: this.root, leaf: this.nodes[0][leafIndex], pathIndices, siblings }
  }

  verify (proof: any): boolean {
    let node = proof.leaf

    for (let i = 0; i < proof.siblings.length; i += 1) {
      const children = proof.siblings[i].slice()

      children.splice(proof.pathIndices[i], 0, node)

      node = this.hashFn(children)
    }

    return proof.root === node
  }

  toString ():string {
    return this.toTreeString()
  }

  protected toTreeString ():string {
    const obj = this.getLayersAsObject()
    return treeify.asTree(obj, true)
  }
}

if (typeof window !== 'undefined') {
  ;(window as any).IncrementalMerkleTree = IncrementalMerkleTree
}

import { Buffer } from 'buffer'
import SHA256 from 'crypto-js/sha256'
import Base from './Base'

// @credit: https://github.com/wanseob/solidity-mmr
/**
 * @desc The index of this MMR implementation starts from 1 not 0.
 */
export class MerkleMountainRange extends Base {
  root: Buffer = Buffer.alloc(0)
  size: number = 0
  width: number = 0
  hashes: any = {}
  data: any = {}
  hashLeafFn: any
  peakBaggingFn: any
  hashBranchFn: any
  private hashFn: any

  constructor (hashFn = SHA256, leaves: any[] = [], hashLeafFn?: any, peakBaggingFn?: any, hashBranchFn?: any) {
    super()
    leaves = leaves.map(this.bufferify)
    this.hashFn = this.bufferifyFn(hashFn)
    this.hashLeafFn = hashLeafFn
    this.peakBaggingFn = peakBaggingFn
    this.hashBranchFn = hashBranchFn

    for (const leaf of leaves) {
      this.append(leaf)
    }
  }

  /**
   * @desc This only stores the hashed value of the leaf.
   * If you need to retrieve the detail data later, use a map to store them.
   */
  append (data: Buffer | string) {
    data = this.bufferify(data)
    const dataHash = this.hashFn(data)
    const dataHashHex = this.bufferToHex(dataHash)
    if (!this.data[dataHashHex] || this.bufferToHex(this.hashFn(this.data[dataHashHex])) !== dataHashHex) {
      this.data[dataHashHex] = data
    }

    const leaf = this.hashLeaf(this.size + 1, dataHash)
    this.hashes[this.size + 1] = leaf
    this.width += 1

    // find peaks for enlarged tree
    const peakIndexes = this.getPeakIndexes(this.width)

    // the right most peak's value is the new size of the updated tree
    this.size = this.getSize(this.width)

    // starting from the left-most peak, get all peak hashes
    const peaks = []
    for (let i = 0; i < peakIndexes.length; i++) {
      peaks[i] = this._getOrCreateNode(peakIndexes[i])
    }

    // update the tree root hash
    this.root = this.peakBagging(this.width, peaks)
  }

  /**
   * @desc It returns the hash of a leaf node with hash(M | DATA )
   *       M is the index of the node.
   */
  hashLeaf (index: number, dataHash: Buffer | string) {
    dataHash = this.bufferify(dataHash)
    if (this.hashLeafFn) {
      return this.bufferify(this.hashLeafFn(index, dataHash))
    }
    return this.hashFn(Buffer.concat([this.bufferify(index), dataHash]))
  }

  /**
   * @desc It returns the hash a parent node with hash(M | Left child | Right child)
   *       M is the index of the node.
   */
  hashBranch (index: number, left: any, right: any): any {
    if (this.hashBranchFn) {
      return this.bufferify(this.hashBranchFn(index, left, right))
    }
    return this.hashFn(Buffer.concat([this.bufferify(index), this.bufferify(left), this.bufferify(right)]))
  }

  getPeaks () {
    const peakIndexes = this.getPeakIndexes(this.width)
    const peaks = []
    for (let i = 0; i < peakIndexes.length; i++) {
      peaks[i] = this.hashes[peakIndexes[i]]
    }
    return peaks
  }

  getLeafIndex (width: number) {
    if (width % 2 === 1) {
      return this.getSize(width)
    }

    return this.getSize(width - 1) + 1
  }

  /**
   * @desc It returns all peaks of the smallest merkle mountain range tree which includes
   *       the given index(size).
   */
  getPeakIndexes (width: number): number[] {
    const numPeaks = this.numOfPeaks(width)
    const peakIndexes = []
    let count = 0
    let size = 0
    for (let i = 255; i > 0; i--) {
      if ((width & (1 << (i - 1))) !== 0) {
        // peak exists
        size = size + (1 << i) - 1
        peakIndexes[count++] = size
        if (peakIndexes.length >= numPeaks) {
          break
        }
      }
    }

    if (count !== peakIndexes.length) {
      throw new Error('invalid bit calculation')
    }

    return peakIndexes
  }

  numOfPeaks (width: number): number {
    let bits = width
    let num = 0
    while (bits > 0) {
      if (bits % 2 === 1) {
        num++
      }
      bits = bits >> 1
    }
    return num
  }

  peakBagging (width: number, peaks: any[]): any {
    const size = this.getSize(width)
    if (this.numOfPeaks(width) !== peaks.length) {
      throw new Error('received invalid number of peaks')
    }

    if (width === 0 && !peaks.length) {
      return Buffer.alloc(0)
    }

    if (this.peakBaggingFn) {
      return this.bufferify(this.peakBaggingFn(size, peaks))
    }

    return this.hashFn(Buffer.concat([this.bufferify(size), ...peaks.map(this.bufferify)]))
  }

  /**
   * @desc It returns the size of the tree.
   */
  getSize (width: number): number {
    return (width << 1) - this.numOfPeaks(width)
  }

  /**
   * @desc It returns the root value of the tree.
   */
  getRoot (): any {
    return this.root
  }

  getHexRoot (): any {
    return this.bufferToHex(this.getRoot())
  }

  /**
   * @dev It returns the hash value of a node for the given position. Note that the index starts from 1.
   */
  getNode (index: number): any {
    return this.hashes[index]
  }

  /**
   * @desc It returns the height of the highest peak.
   */
  mountainHeight (size: number): number {
    let height = 1
    while (1 << height <= size + height) {
      height++
    }
    return height - 1
  }

  /**
   * @desc It returns the height of the index.
   */
  heightAt (index: number): number {
    let reducedIndex = index
    let peakIndex = 0
    let height = 0

    // if an index has a left mountain then subtract the mountain
    while (reducedIndex > peakIndex) {
      reducedIndex -= (1 << height) - 1
      height = this.mountainHeight(reducedIndex)
      peakIndex = (1 << height) - 1
    }

    // index is on the right slope
    return height - (peakIndex - reducedIndex)
  }

  /**
   * @desc It returns whether the index is the leaf node or not
   */
  isLeaf (index: number): boolean {
    return this.heightAt(index) === 1
  }

  /**
   * @desc It returns the children when it is a parent node.
   */
  getChildren (index: number) {
    const left = index - (1 << (this.heightAt(index) - 1))
    const right = index - 1
    if (left === right) {
      throw new Error('not a parent')
    }

    return [left, right]
  }

  /**
   * @desc It returns a merkle proof for a leaf. Note that the index starts from 1.
   */
  getMerkleProof (index: number) {
    if (index > this.size) {
      throw new Error('out of range')
    }
    if (!this.isLeaf(index)) {
      throw new Error('not a leaf')
    }

    const root = this.root
    const width = this.width

    // find all peaks for bagging
    const peaks = this.getPeakIndexes(this.width)
    const peakBagging = []
    let cursor = 0

    for (let i = 0; i < peaks.length; i++) {
      // collect the hash of all peaks
      peakBagging[i] = this.hashes[peaks[i]]

      // find the peak which includes the target index
      if (peaks[i] >= index && cursor === 0) {
        cursor = peaks[i]
      }
    }

    let left = 0
    let right = 0

    // get hashes of the siblings in the mountain which the index belgons to.
    // it moves the cursor from the summit of the mountain down to the target index
    let height = this.heightAt(cursor)
    const siblings = []
    while (cursor !== index) {
      height--
      ([left, right] = this.getChildren(cursor))

      // move the cursor down to the left size or right size
      cursor = index <= left ? left : right

      // remaining node is the sibling
      siblings[height - 1] = this.hashes[index <= left ? right : left]
    }

    return {
      root,
      width,
      peakBagging,
      siblings
    }
  }

  /**
   * @desc It returns true when the given params verifies that the given value exists in the tree or reverts the transaction.
   */
  verify (root: any, width: number, index: number, value: Buffer | string, peaks: any[], siblings: any[]) {
    value = this.bufferify(value)
    const size = this.getSize(width)
    if (size < index) {
      throw new Error('index is out of range')
    }

    // check the root equals the peak bagging hash
    if (!root.equals(this.peakBagging(width, peaks))) {
      throw new Error('invalid root hash from the peaks')
    }

    // find the mountain where the target index belongs to
    let cursor = 0
    let targetPeak : number

    const peakIndexes = this.getPeakIndexes(width)
    for (let i = 0; i < peakIndexes.length; i++) {
      if (peakIndexes[i] >= index) {
        targetPeak = peaks[i]
        cursor = peakIndexes[i]
        break
      }
    }

    if (!targetPeak) {
      throw new Error('target not found')
    }

    // find the path climbing down
    let height = siblings.length + 1
    const path = new Array(height)
    let left = 0
    let right = 0

    while (height > 0) {
      // record the current cursor and climb down
      path[--height] = cursor
      if (cursor === index) {
        // on the leaf node. Stop climbing down
        break
      } else {
        // on the parent node. Go left or right
        ([left, right] = this.getChildren(cursor))
        cursor = index > left ? right : left
        continue
      }
    }

    // calculate the summit hash climbing up again
    let node : any
    while (height < path.length) {
      // move cursor
      cursor = path[height]
      if (height === 0) {
        // cusor is on the leaf
        node = this.hashLeaf(cursor, this.hashFn(value))
      } else if (cursor - 1 === path[height - 1]) {
        // cursor is on a parent and a siblings is on the left
        node = this.hashBranch(cursor, siblings[height - 1], node)
      } else {
        // cursor is on a parent and a siblings is on the right
        node = this.hashBranch(cursor, node, siblings[height - 1])
      }
      // climb up
      height++
    }

    // computed hash value of the summit should equal to the target peak hash
    if (!node.equals(targetPeak)) {
      throw new Error('hashed peak is invalid')
    }

    return true
  }

  peaksToPeakMap (width: number, peaks: any[]) {
    const peakMap = {}
    let bitIndex = 0
    let peakRef = 0
    let count = peaks.length
    for (let height = 1; height <= 32; height++) {
      // index starts from the right most bit
      bitIndex = 32 - height
      peakRef = 1 << (height - 1)
      if ((width & peakRef) !== 0) {
        peakMap[bitIndex] = peaks[--count]
      } else {
        peakMap[bitIndex] = 0
      }
    }

    if (count !== 0) {
      throw new Error('invalid number of peaks')
    }

    return peakMap
  }

  peakMapToPeaks (width: number, peakMap: any) {
    const arrLength = this.numOfPeaks(width)
    const peaks = new Array(arrLength)
    let count = 0
    for (let i = 0; i < 32; i++) {
      if (peakMap[i] !== 0) {
        peaks[count++] = peakMap[i]
      }
    }

    if (count !== arrLength) {
      throw new Error('invalid number of peaks')
    }

    return peaks
  }

  peakUpdate (width: number, prevPeakMap: any, itemHash: any) {
    const nextPeakMap = {}
    const newWidth = width + 1
    let cursorIndex = this.getLeafIndex(newWidth)
    let cursorNode = this.hashLeaf(cursorIndex, itemHash)
    let bitIndex = 0
    let peakRef = 0
    let prevPeakExist = false
    let nextPeakExist = false
    let obtained = false

    for (let height = 1; height <= 32; height++) {
      // index starts from the right most bit
      bitIndex = 32 - height
      if (obtained) {
        nextPeakMap[bitIndex] = prevPeakMap[bitIndex]
      } else {
        peakRef = 1 << (height - 1)
        prevPeakExist = (width & peakRef) !== 0
        nextPeakExist = (newWidth & peakRef) !== 0

        // get new cursor node with hashing the peak and the current cursor
        cursorIndex++
        if (prevPeakExist) {
          cursorNode = this.hashBranch(cursorIndex, prevPeakMap[bitIndex], cursorNode)
        }
        // if new peak exists for the bit index
        if (nextPeakExist) {
          // if prev peak exists for the bit index
          if (prevPeakExist) {
            nextPeakMap[bitIndex] = prevPeakMap[bitIndex]
          } else {
            nextPeakMap[bitIndex] = cursorNode
          }
          obtained = true
        } else {
          nextPeakMap[bitIndex] = 0
        }
      }
    }

    return nextPeakMap
  }

  rollUp (root: any, width: number, peaks: any[], itemHashes: any[]) {
    // check the root equals the peak bagging hash
    if (!root.equals(this.peakBagging(width, peaks))) {
      throw new Error('invalid root hash from the peaks')
    }

    let tmpWidth = width
    let tmpPeakMap = this.peaksToPeakMap(width, peaks)
    for (let i = 0; i < itemHashes.length; i++) {
      tmpPeakMap = this.peakUpdate(tmpWidth, tmpPeakMap, itemHashes[i])
      tmpWidth++
    }

    return this.peakBagging(tmpWidth, this.peakMapToPeaks(tmpWidth, tmpPeakMap))
  }

  /**
   * @desc It returns the hash value of the node for the index.
   *      If the hash already exists it simply returns the stored value. On the other hand,
   *      it computes hashes recursively downward.
   *      Only appending an item calls this function.
   */
  private _getOrCreateNode (index: number) {
    if (index > this.size) {
      throw new Error('out of range')
    }

    if (!this.hashes[index]) {
      const [leftIndex, rightIndex] = this.getChildren(index)
      const leftHash = this._getOrCreateNode(leftIndex)
      const rightHash = this._getOrCreateNode(rightIndex)
      this.hashes[index] = this.hashBranch(index, leftHash, rightHash)
    }

    return this.hashes[index]
  }
}

if (typeof window !== 'undefined') {
  ;(window as any).MerkleMountainRange = MerkleMountainRange
}


import { Base } from './Base'

// @credit: https://github.com/finalitylabs/pymst

type TValue = Buffer | BigInt | string | number | null | undefined
type THashFn = (value: TValue) => Buffer

export class Bucket {
  size: BigInt
  hashed: Buffer
  parent: Bucket | null
  left: Bucket | null
  right: Bucket | null

  constructor (size: BigInt | number, hashed: Buffer) {
    this.size = BigInt(size)
    this.hashed = hashed

    // each node in the tree can have a parent, and a left or right sibling
    this.parent = null
    this.left = null
    this.right = null
  }
}

export class Leaf {
  hashFn: THashFn
  rng: BigInt[]
  data: Buffer | null

  constructor (hashFn: THashFn, rng: (number | BigInt)[], data: Buffer | null) {
    this.hashFn = hashFn
    this.rng = rng.map(x => BigInt(x))
    this.data = data
  }

  getBucket () {
    let hashed : Buffer
    if (this.data) {
      hashed = this.hashFn(this.data)
    } else {
      hashed = Buffer.alloc(32)
    }
    return new Bucket(BigInt(this.rng[1]) - BigInt(this.rng[0]), hashed)
  }
}

export class ProofStep {
  bucket: Bucket
  right: boolean

  constructor (bucket: Bucket, right: boolean) {
    this.bucket = bucket
    this.right = right // whether the bucket hash should be appeded on the right side in this step (default is left
  }
}

export class MerkleSumTree extends Base {
  hashFn: THashFn
  leaves: Leaf[]
  buckets: Bucket[]
  root: Bucket

  constructor (leaves: Leaf[], hashFn: THashFn) {
    super()
    this.leaves = leaves
    this.hashFn = hashFn

    MerkleSumTree.checkConsecutive(leaves)

    this.buckets = []
    for (const l of leaves) {
      this.buckets.push(l.getBucket())
    }

    let buckets = []
    for (const bucket of this.buckets) {
      buckets.push(bucket)
    }

    while (buckets.length !== 1) {
      const newBuckets = []
      while (buckets.length) {
        if (buckets.length >= 2) {
          const b1 = buckets.shift()
          const b2 = buckets.shift()
          const size = b1.size + b2.size
          const hashed = this.hashFn(Buffer.concat([this.sizeToBuffer(b1.size), this.bufferify(b1.hashed), this.sizeToBuffer(b2.size), this.bufferify(b2.hashed)]))
          const b = new Bucket(size, hashed)
          b2.parent = b
          b1.parent = b2.parent
          b1.right = b2
          b2.left = b1
          newBuckets.push(b)
        } else {
          newBuckets.push(buckets.shift())
        }
      }
      buckets = newBuckets
    }
    this.root = buckets[0]
  }

  sizeToBuffer (size: BigInt) {
    const buf = Buffer.alloc(8)
    const view = new DataView(buf.buffer)
    view.setBigInt64(0, BigInt(size), false) // true when little endian
    return buf
  }

  static checkConsecutive (leaves: Leaf[]) {
    let curr = BigInt(0)
    for (const leaf of leaves) {
      if (leaf.rng[0] !== curr) {
        throw new Error('leaf ranges are invalid')
      }
      curr = BigInt(leaf.rng[1])
    }
  }

  // gets inclusion/exclusion proof of a bucket in the specified index
  getProof (index: number | BigInt) {
    let curr = this.buckets[Number(index)]
    const proof = []
    while (curr && curr.parent) {
      const right = !!curr.right
      const bucket = curr.right ? curr.right : curr.left
      curr = curr.parent
      proof.push(new ProofStep(bucket, right))
    }
    return proof
  }

  sum (arr: BigInt[]) {
    let total = BigInt(0)
    for (const value of arr) {
      total += BigInt(value)
    }
    return total
  }

  // validates the suppplied proof for a specified leaf according to the root bucket
  verifyProof (root: Bucket, leaf: Leaf, proof: ProofStep[]) {
    const rng = [this.sum(proof.filter(x => !x.right).map(x => x.bucket.size)), BigInt(root.size) - this.sum(proof.filter(x => x.right).map(x => x.bucket.size))]
    if (!(rng[0] === leaf.rng[0] && rng[1] === leaf.rng[1])) {
      // supplied steps are not routing to the range specified
      return false
    }
    let curr = leaf.getBucket()
    let hashed :Buffer
    for (const step of proof) {
      if (step.right) {
        hashed = this.hashFn(Buffer.concat([this.sizeToBuffer(curr.size), this.bufferify(curr.hashed), this.sizeToBuffer(step.bucket.size), this.bufferify(step.bucket.hashed)]))
      } else {
        hashed = this.hashFn(Buffer.concat([this.sizeToBuffer(step.bucket.size), this.bufferify(step.bucket.hashed), this.sizeToBuffer(curr.size), this.bufferify(curr.hashed)]))
      }
      curr = new Bucket(BigInt(curr.size) + BigInt(step.bucket.size), hashed)
    }
    return curr.size === root.size && curr.hashed.toString('hex') === root.hashed.toString('hex')
  }
}

if (typeof window !== 'undefined') {
  ;(window as any).MerkleSumTree = MerkleSumTree
}


import { Buffer } from 'buffer'
import reverse from 'buffer-reverse'
import SHA256 from 'crypto-js/sha256'
import treeify from 'treeify'
import Base from './Base'

// TODO: Clean up and DRY up code
// Disclaimer: The multiproof code is unaudited and may possibly contain serious issues. It's in a hacky state as is and needs to be rewritten.

type TValue = Buffer | BigInt | string | number | null | undefined
type THashFnResult = Buffer | string
type THashFn = (value: TValue) => Buffer
type TLeaf = Buffer
type TLayer = any
type TFillDefaultHash = (idx?: number, hashFn?: THashFn) => THashFnResult

export interface Options {
  /** If set to `true`, an odd node will be duplicated and combined to make a pair to generate the layer hash. */
  duplicateOdd?: boolean
  /** If set to `true`, the leaves will hashed using the set hashing algorithms. */
  hashLeaves?: boolean
  /** If set to `true`, constructs the Merkle Tree using the [Bitcoin Merkle Tree implementation](http://www.righto.com/2014/02/bitcoin-mining-hard-way-algorithms.html). Enable it when you need to replicate Bitcoin constructed Merkle Trees. In Bitcoin Merkle Trees, single nodes are combined with themselves, and each output hash is hashed again. */
  isBitcoinTree?: boolean
  /** If set to `true`, the leaves will be sorted. Recommended for use of multiProofs. */
  sortLeaves?: boolean
  /** If set to `true`, the hashing pairs will be sorted. */
  sortPairs?: boolean
  /** If set to `true`, the leaves and hashing pairs will be sorted. */
  sort?: boolean
  /** If defined, the resulting hash of this function will be used to fill in odd numbered layers. */
  fillDefaultHash?: TFillDefaultHash | Buffer | string
  /** If set to `true`, the resulting tree will be a complete tree. Recommended for use of multiProofs. */
  complete?: boolean;

  concatenator?: (inputs: Buffer[]) => Buffer | Buffer[] | BigInt[]
}

/**
 * Class reprensenting a Merkle Tree
 * @namespace MerkleTree
 */
export class MerkleTree extends Base {
  private duplicateOdd: boolean = false
  private hashFn: THashFn
  private concatenator: any = Buffer.concat
  private hashLeaves: boolean = false
  private isBitcoinTree: boolean = false
  private leaves: TLeaf[] = []
  private layers: TLayer[] = []
  private sortLeaves: boolean = false
  private sortPairs: boolean = false
  private sort: boolean = false
  private fillDefaultHash: TFillDefaultHash | null = null
  private complete: boolean = false

  /**
   * @desc Constructs a Merkle Tree.
   * All nodes and leaves are stored as Buffers.
   * Lonely leaf nodes are promoted to the next level up without being hashed again.
   * @param {Buffer[]} leaves - Array of hashed leaves. Each leaf must be a Buffer.
   * @param {Function} hashFunction - Hash function to use for hashing leaves and nodes
   * @param {Object} options - Additional options
   * @example
   *```js
   *const MerkleTree = require('merkletreejs')
   *const crypto = require('crypto')
   *
   *function sha256(data) {
   *  // returns Buffer
   *  return crypto.createHash('sha256').update(data).digest()
   *}
   *
   *const leaves = ['a', 'b', 'c'].map(value => keccak(value))
   *
   *const tree = new MerkleTree(leaves, sha256)
   *```
   */
  constructor (leaves: any[], hashFn = SHA256, options: Options = {}) {
    super()

    if (options.complete) {
      if (options.isBitcoinTree) {
        throw new Error('option "complete" is incompatible with "isBitcoinTree"')
      }
      if (options.duplicateOdd) {
        throw new Error('option "complete" is incompatible with "duplicateOdd"')
      }
    }

    this.isBitcoinTree = !!options.isBitcoinTree
    this.hashLeaves = !!options.hashLeaves
    this.sortLeaves = !!options.sortLeaves
    this.sortPairs = !!options.sortPairs
    this.complete = !!options.complete

    if (options.fillDefaultHash) {
      if (typeof options.fillDefaultHash === 'function') {
        this.fillDefaultHash = options.fillDefaultHash
      } else if (Buffer.isBuffer(options.fillDefaultHash) || typeof options.fillDefaultHash === 'string') {
        this.fillDefaultHash = (idx?: number, hashFn?: THashFn):THashFnResult => options.fillDefaultHash as THashFnResult
      } else {
        throw new Error('method "fillDefaultHash" must be a function, Buffer, or string')
      }
    }

    this.sort = !!options.sort
    if (this.sort) {
      this.sortLeaves = true
      this.sortPairs = true
    }

    this.duplicateOdd = !!options.duplicateOdd

    if (options.concatenator) {
      this.concatenator = options.concatenator
    }

    this.hashFn = this.bufferifyFn(hashFn)
    this.processLeaves(leaves)
  }

  public getOptions () {
    return {
      complete: this.complete,
      isBitcoinTree: this.isBitcoinTree,
      hashLeaves: this.hashLeaves,
      sortLeaves: this.sortLeaves,
      sortPairs: this.sortPairs,
      sort: this.sort,
      fillDefaultHash: this.fillDefaultHash?.toString() ?? null,
      duplicateOdd: this.duplicateOdd
    }
  }

  private processLeaves (leaves: TLeaf[]) {
    if (this.hashLeaves) {
      leaves = leaves.map(this.hashFn)
    }

    this.leaves = leaves.map(this.bufferify)
    if (this.sortLeaves) {
      this.leaves = this.leaves.sort(Buffer.compare)
    }

    if (this.fillDefaultHash) {
      for (let i = this.leaves.length; i < Math.pow(2, Math.ceil(Math.log2(this.leaves.length))); i++) {
        this.leaves.push(this.bufferify(this.fillDefaultHash(i, this.hashFn)))
      }
    }

    this.createHashes(this.leaves)
  }

  private createHashes (nodes: any[]) {
    this.layers = [nodes]
    while (nodes.length > 1) {
      const layerIndex = this.layers.length

      this.layers.push([])

      const layerLimit = this.complete && layerIndex === 1 && !Number.isInteger(Math.log2(nodes.length))
        ? (2 * nodes.length) - (2 ** Math.ceil(Math.log2(nodes.length)))
        : nodes.length

      for (let i = 0; i < nodes.length; i += 2) {
        if (i >= layerLimit) {
          this.layers[layerIndex].push(...nodes.slice(layerLimit))
          break
        } else if (i + 1 === nodes.length) {
          if (nodes.length % 2 === 1) {
            const data = nodes[nodes.length - 1]
            let hash = data

            // is bitcoin tree
            if (this.isBitcoinTree) {
              // Bitcoin method of duplicating the odd ending nodes
              hash = this.hashFn(this.concatenator([reverse(data), reverse(data)]))
              hash = reverse(this.hashFn(hash))

              this.layers[layerIndex].push(hash)
              continue
            } else {
              if (this.duplicateOdd) {
                // continue with creating layer
              } else {
                // push copy of hash and continue iteration
                this.layers[layerIndex].push(nodes[i])
                continue
              }
            }
          }
        }

        const left = nodes[i]
        const right = i + 1 === nodes.length ? left : nodes[i + 1]
        let combined = null

        if (this.isBitcoinTree) {
          combined = [reverse(left), reverse(right)]
        } else {
          combined = [left, right]
        }

        if (this.sortPairs) {
          combined.sort(Buffer.compare)
        }

        let hash = this.hashFn(this.concatenator(combined))

        // double hash if bitcoin tree
        if (this.isBitcoinTree) {
          hash = reverse(this.hashFn(hash))
        }

        this.layers[layerIndex].push(hash)
      }

      nodes = this.layers[layerIndex]
    }
  }

  /**
   * addLeaf
   * @desc Adds a leaf to the tree and re-calculates layers.
   * @param {String|Buffer} - Leaf
   * @param {Boolean} - Set to true if the leaf should be hashed before being added to tree.
   * @example
   *```js
   *tree.addLeaf(newLeaf)
   *```
   */
  addLeaf (leaf: TLeaf, shouldHash: boolean = false) {
    if (shouldHash) {
      leaf = this.hashFn(leaf)
    }
    this.processLeaves(this.leaves.concat(leaf))
  }

  /**
   * addLeaves
   * @desc Adds multiple leaves to the tree and re-calculates layers.
   * @param {String[]|Buffer[]} - Array of leaves
   * @param {Boolean} - Set to true if the leaves should be hashed before being added to tree.
   * @example
   *```js
   *tree.addLeaves(newLeaves)
   *```
   */
  addLeaves (leaves: TLeaf[], shouldHash: boolean = false) {
    if (shouldHash) {
      leaves = leaves.map(this.hashFn)
    }
    this.processLeaves(this.leaves.concat(leaves))
  }

  /**
   * getLeaves
   * @desc Returns array of leaves of Merkle Tree.
   * @return {Buffer[]}
   * @example
   *```js
   *const leaves = tree.getLeaves()
   *```
   */
  getLeaves (values?: any[]):Buffer[] {
    if (Array.isArray(values)) {
      if (this.hashLeaves) {
        values = values.map(this.hashFn)
        if (this.sortLeaves) {
          values = values.sort(Buffer.compare)
        }
      }

      return this.leaves.filter(leaf => this.bufferIndexOf(values, leaf, this.sortLeaves) !== -1)
    }

    return this.leaves
  }

  /**
   * getLeaf
   * @desc Returns the leaf at the given index.
   * @param {Number} - Index number
   * @return {Buffer}
   * @example
   *```js
   *const leaf = tree.getLeaf(1)
   *```
   */
  getLeaf (index: number):Buffer {
    if (index < 0 || index > this.leaves.length - 1) {
      return Buffer.from([])
    }

    return this.leaves[index]
  }

  /**
   * getLeafIndex
   * @desc Returns the index of the given leaf, or -1 if the leaf is not found.
   * @param {String|Buffer} - Target leaf
   * @return {number}
   * @example
   *```js
   *const leaf = Buffer.from('abc')
   *const index = tree.getLeafIndex(leaf)
   *```
   */
  getLeafIndex (target: TLeaf):number {
    target = this.bufferify(target)
    const leaves = this.getLeaves()
    for (let i = 0; i < leaves.length; i++) {
      const leaf = leaves[i]
      if (leaf.equals(target)) {
        return i
      }
    }

    return -1
  }

  /**
   * getLeafCount
   * @desc Returns the total number of leaves.
   * @return {number}
   * @example
   *```js
   *const count = tree.getLeafCount()
   *```
   */
  getLeafCount (): number {
    return this.leaves.length
  }

  /**
   * getHexLeaves
   * @desc Returns array of leaves of Merkle Tree as hex strings.
   * @return {String[]}
   * @example
   *```js
   *const leaves = tree.getHexLeaves()
   *```
   */
  getHexLeaves ():string[] {
    return this.leaves.map(leaf => this.bufferToHex(leaf))
  }

  /**
   * marshalLeaves
   * @desc Returns array of leaves of Merkle Tree as a JSON string.
   * @param {String[]|Buffer[]} - Merkle tree leaves
   * @return {String} - List of leaves as JSON string
   * @example
   *```js
   *const jsonStr = MerkleTree.marshalLeaves(leaves)
   *```
   */
  static marshalLeaves (leaves: any[]):string {
    return JSON.stringify(leaves.map(leaf => MerkleTree.bufferToHex(leaf)), null, 2)
  }

  /**
   * unmarshalLeaves
   * @desc Returns array of leaves of Merkle Tree as a Buffers.
   * @param {String|Object} - JSON stringified leaves
   * @return {Buffer[]} - Unmarshalled list of leaves
   * @example
   *```js
   *const leaves = MerkleTree.unmarshalLeaves(jsonStr)
   *```
   */
  static unmarshalLeaves (jsonStr: string | object):Buffer[] {
    let parsed :any = null
    if (typeof jsonStr === 'string') {
      parsed = JSON.parse(jsonStr)
    } else if (jsonStr instanceof Object) {
      parsed = jsonStr
    } else {
      throw new Error('Expected type of string or object')
    }

    if (!parsed) {
      return []
    }

    if (!Array.isArray(parsed)) {
      throw new Error('Expected JSON string to be array')
    }

    return parsed.map(MerkleTree.bufferify)
  }

  /**
   * getLayers
   * @desc Returns multi-dimensional array of all layers of Merkle Tree, including leaves and root.
   * @return {Buffer[][]}
   * @example
   *```js
   *const layers = tree.getLayers()
   *```
   */
  getLayers ():Buffer[][] {
    return this.layers
  }

  /**
   * getHexLayers
   * @desc Returns multi-dimensional array of all layers of Merkle Tree, including leaves and root as hex strings.
   * @return {String[][]}
   * @example
   *```js
   *const layers = tree.getHexLayers()
   *```
   */
  getHexLayers ():string[][] {
    return this.layers.reduce((acc: string[][], item: Buffer[]) => {
      if (Array.isArray(item)) {
        acc.push(item.map(layer => this.bufferToHex(layer)))
      } else {
        acc.push(item)
      }

      return acc
    }, [])
  }

  /**
   * getLayersFlat
   * @desc Returns single flat array of all layers of Merkle Tree, including leaves and root.
   * @return {Buffer[]}
   * @example
   *```js
   *const layers = tree.getLayersFlat()
   *```
   */
  getLayersFlat ():Buffer[] {
    const layers = this.layers.reduce((acc, item) => {
      if (Array.isArray(item)) {
        acc.unshift(...item)
      } else {
        acc.unshift(item)
      }

      return acc
    }, [])

    layers.unshift(Buffer.from([0]))

    return layers
  }

  /**
   * getHexLayersFlat
   * @desc Returns single flat array of all layers of Merkle Tree, including leaves and root as hex string.
   * @return {String[]}
   * @example
   *```js
   *const layers = tree.getHexLayersFlat()
   *```
   */
  getHexLayersFlat ():string[] {
    return this.getLayersFlat().map(layer => this.bufferToHex(layer))
  }

  /**
   * getLayerCount
   * @desc Returns the total number of layers.
   * @return {number}
   * @example
   *```js
   *const count = tree.getLayerCount()
   *```
   */
  getLayerCount ():number {
    return this.getLayers().length
  }

  /**
   * getRoot
   * @desc Returns the Merkle root hash as a Buffer.
   * @return {Buffer}
   * @example
   *```js
   *const root = tree.getRoot()
   *```
   */
  getRoot ():Buffer {
    if (this.layers.length === 0) {
      return Buffer.from([])
    }

    return this.layers[this.layers.length - 1][0] || Buffer.from([])
  }

  /**
   * getHexRoot
   * @desc Returns the Merkle root hash as a hex string.
   * @return {String}
   * @example
   *```js
   *const root = tree.getHexRoot()
   *```
   */
  getHexRoot ():string {
    return this.bufferToHex(this.getRoot())
  }

  /**
   * getProof
   * @desc Returns the proof for a target leaf.
   * @param {Buffer} leaf - Target leaf
   * @param {Number} [index] - Target leaf index in leaves array.
   * Use if there are leaves containing duplicate data in order to distinguish it.
   * @return {Object[]} - Array of objects containing a position property of type string
   * with values of 'left' or 'right' and a data property of type Buffer.
   * @example
   * ```js
   *const proof = tree.getProof(leaves[2])
   *```
   *
   * @example
   *```js
   *const leaves = ['a', 'b', 'a'].map(value => keccak(value))
   *const tree = new MerkleTree(leaves, keccak)
   *const proof = tree.getProof(leaves[2], 2)
   *```
   */
  getProof (leaf: Buffer | string, index?: number):{position: 'left' | 'right', data: Buffer}[] {
    if (typeof leaf === 'undefined') {
      throw new Error('leaf is required')
    }
    leaf = this.bufferify(leaf)
    const proof = []

    if (!Number.isInteger(index)) {
      index = -1

      for (let i = 0; i < this.leaves.length; i++) {
        if (Buffer.compare(leaf, this.leaves[i]) === 0) {
          index = i
        }
      }
    }

    if (index <= -1) {
      return []
    }

    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i]
      const isRightNode = index % 2
      const pairIndex = (isRightNode ? index - 1
        : this.isBitcoinTree && index === layer.length - 1 && i < this.layers.length - 1
          // Proof Generation for Bitcoin Trees
          ? index
          // Proof Generation for Non-Bitcoin Trees
          : index + 1)

      if (pairIndex < layer.length) {
        proof.push({
          position: isRightNode ? 'left' : 'right',
          data: layer[pairIndex]
        })
      }

      // set index to parent index
      index = (index / 2) | 0
    }

    return proof
  }

  /**
   * getHexProof
   * @desc Returns the proof for a target leaf as hex strings.
   * @param {Buffer} leaf - Target leaf
   * @param {Number} [index] - Target leaf index in leaves array.
   * Use if there are leaves containing duplicate data in order to distinguish it.
   * @return {String[]} - Proof array as hex strings.
   * @example
   * ```js
   *const proof = tree.getHexProof(leaves[2])
   *```
   */
  getHexProof (leaf: Buffer | string, index?: number):string[] {
    return this.getProof(leaf, index).map(item => this.bufferToHex(item.data))
  }

  /**
   * getProofs
   * @desc Returns the proofs for all leaves.
   * @return {Object[]} - Array of objects containing a position property of type string
   * with values of 'left' or 'right' and a data property of type Buffer for all leaves.
   * @example
   * ```js
   *const proofs = tree.getProofs()
   *```
   *
   * @example
   *```js
   *const leaves = ['a', 'b', 'a'].map(value => keccak(value))
   *const tree = new MerkleTree(leaves, keccak)
   *const proofs = tree.getProofs()
   *```
   */
  getProofs ():any[] {
    const proof = []; const proofs = []

    this.getProofsDFS(this.layers.length - 1, 0, proof, proofs)

    return proofs
  }

  /**
   * getProofsDFS
   * @desc Get all proofs through single traverse
   * @param {Number} currentLayer - Current layer index in traverse.
   * @param {Number} index - Current tarvese node index in traverse.
   * @param {Object[]} proof - Proof chain for single leaf.
   * @param {Object[]} proofs - Proofs for all leaves
   * @example
   * ```js
   *const layers = tree.getLayers()
   *const index = 0;
   *let proof = [];
   *let proofs = [];
   *const proof = tree.getProofsDFS(layers, index, proof, proofs)
   *```
   */
  getProofsDFS (currentLayer, index, proof, proofs):any[] {
    const isRightNode = index % 2
    if (currentLayer === -1) {
      if (!isRightNode) proofs.push([...proof].reverse())
      return
    }
    if (index >= this.layers[currentLayer].length) return

    const layer = this.layers[currentLayer]
    const pairIndex = isRightNode ? index - 1 : index + 1

    let pushed = false
    if (pairIndex < layer.length) {
      pushed = true
      proof.push({
        position: isRightNode ? 'left' : 'right',
        data: layer[pairIndex]
      })
    }

    const leftchildIndex = index * 2
    const rightchildIndex = index * 2 + 1

    this.getProofsDFS(currentLayer - 1, leftchildIndex, proof, proofs)
    this.getProofsDFS(currentLayer - 1, rightchildIndex, proof, proofs)

    if (pushed) proof.splice(proof.length - 1, 1)
  }

  /**
   * getHexProofs
   * @desc Returns the proofs for all leaves as hex strings.
   * @return {String[]} - Proofs array as hex strings.
   * @example
   * ```js
   *const proofs = tree.getHexProofs()
   *```
   */
  getHexProofs ():string[] {
    return this.getProofs().map(item => this.bufferToHex(item.data))
  }

  /**
  * getPositionalHexProof
  * @desc Returns the proof for a target leaf as hex strings and the position in binary (left == 0).
  * @param {Buffer} leaf - Target leaf
  * @param {Number} [index] - Target leaf index in leaves array.
  * Use if there are leaves containing duplicate data in order to distinguish it.
  * @return {(string | number)[][]} - Proof array as hex strings. position at index 0
  * @example
  * ```js
  *const proof = tree.getPositionalHexProof(leaves[2])
  *```
  */
  getPositionalHexProof (leaf: Buffer | string, index?: number): (string | number)[][] {
    return this.getProof(leaf, index).map(item => {
      return [
        item.position === 'left' ? 0 : 1,
        this.bufferToHex(item.data)
      ]
    })
  }

  /**
   * marshalProof
   * @desc Returns proof array as JSON string.
   * @param {String[]|Object[]} proof - Merkle tree proof array
   * @return {String} - Proof array as JSON string.
   * @example
   * ```js
   *const jsonStr = MerkleTree.marshalProof(proof)
   *```
   */
  static marshalProof (proof: any[]):string {
    const json = proof.map(item => {
      if (typeof item === 'string') {
        return item
      }

      if (Buffer.isBuffer(item)) {
        return MerkleTree.bufferToHex(item)
      }

      return {
        position: item.position,
        data: MerkleTree.bufferToHex(item.data)
      }
    })

    return JSON.stringify(json, null, 2)
  }

  /**
   * unmarshalProof
   * @desc Returns the proof for a target leaf as a list of Buffers.
   * @param {String|Object} - Merkle tree leaves
   * @return {String|Object} - Marshalled proof
   * @example
   * ```js
   *const proof = MerkleTree.unmarshalProof(jsonStr)
   *```
   */
  static unmarshalProof (jsonStr: string | object):any[] {
    let parsed :any = null
    if (typeof jsonStr === 'string') {
      parsed = JSON.parse(jsonStr)
    } else if (jsonStr instanceof Object) {
      parsed = jsonStr
    } else {
      throw new Error('Expected type of string or object')
    }

    if (!parsed) {
      return []
    }

    if (!Array.isArray(parsed)) {
      throw new Error('Expected JSON string to be array')
    }

    return parsed.map(item => {
      if (typeof item === 'string') {
        return MerkleTree.bufferify(item)
      } else if (item instanceof Object) {
        return {
          position: item.position,
          data: MerkleTree.bufferify(item.data)
        }
      } else {
        throw new Error('Expected item to be of type string or object')
      }
    })
  }

  static marshalTree (tree: MerkleTree):string {
    const root = tree.getHexRoot()
    const leaves = tree.leaves.map(leaf => MerkleTree.bufferToHex(leaf))
    const layers = tree.getHexLayers()
    const options = tree.getOptions()

    return JSON.stringify({
      options,
      root,
      layers,
      leaves
    }, null, 2)
  }

  static unmarshalTree (jsonStr: string | object, hashFn = SHA256, options: Options = {}):MerkleTree {
    let parsed :any = null
    if (typeof jsonStr === 'string') {
      parsed = JSON.parse(jsonStr)
    } else if (jsonStr instanceof Object) {
      parsed = jsonStr
    } else {
      throw new Error('Expected type of string or object')
    }

    if (!parsed) {
      throw new Error('could not parse json')
    }

    options = Object.assign({}, parsed.options || {}, options)

    return new MerkleTree(parsed.leaves, hashFn, options)
  }

  /**
   * getProofIndices
   * @desc Returns the proof indices for given tree indices.
   * @param {Number[]} treeIndices - Tree indices
   * @param {Number} depth - Tree depth; number of layers.
   * @return {Number[]} - Proof indices
   * @example
   * ```js
   *const proofIndices = tree.getProofIndices([2,5,6], 4)
   *console.log(proofIndices) // [ 23, 20, 19, 8, 3 ]
   *```
   */
  getProofIndices (treeIndices: number[], depth: number):number[] {
    const leafCount = 2 ** depth
    let maximalIndices :any = new Set()
    for (const index of treeIndices) {
      let x = leafCount + index
      while (x > 1) {
        maximalIndices.add(x ^ 1)
        x = (x / 2) | 0
      }
    }

    const a = treeIndices.map(index => leafCount + index)
    const b = Array.from(maximalIndices).sort((a: any, b: any) => a - b).reverse()
    maximalIndices = a.concat(b as any)

    const redundantIndices = new Set()
    const proof = []

    for (let index of maximalIndices) {
      if (!redundantIndices.has(index)) {
        proof.push(index)
        while (index > 1) {
          redundantIndices.add(index)
          if (!redundantIndices.has(index as number ^ 1)) break
          index = (index as number / 2) | 0
        }
      }
    }

    return proof.filter(index => {
      return !treeIndices.includes(index - leafCount)
    })
  }

  private getProofIndicesForUnevenTree (sortedLeafIndices: number[], leavesCount: number): number[][] {
    const depth = Math.ceil(Math.log2(leavesCount))
    const unevenLayers :any[] = []
    for (let index = 0; index < depth; index++) {
      const unevenLayer = leavesCount % 2 !== 0
      if (unevenLayer) {
        unevenLayers.push({ index, leavesCount })
      }
      leavesCount = Math.ceil(leavesCount / 2)
    }

    const proofIndices: number[][] = []

    let layerNodes: any[] = sortedLeafIndices
    for (let layerIndex = 0; layerIndex < depth; layerIndex++) {
      const siblingIndices = layerNodes.map((index: any) => {
        if (index % 2 === 0) {
          return index + 1
        }
        return index - 1
      })
      let proofNodeIndices = siblingIndices.filter((index: any) => !layerNodes.includes(index))
      const unevenLayer = unevenLayers.find(({ index }) => index === layerIndex)
      if (unevenLayer && layerNodes.includes(unevenLayer.leavesCount - 1)) {
        proofNodeIndices = proofNodeIndices.slice(0, -1)
      }

      proofIndices.push(proofNodeIndices)
      layerNodes = [...new Set(layerNodes.map((index: any) => {
        if (index % 2 === 0) {
          return index / 2
        }

        if (index % 2 === 0) {
          return (index + 1) / 2
        }

        return (index - 1) / 2
      }))]
    }

    return proofIndices
  }

  /**
   * getMultiProof
   * @desc Returns the multiproof for given tree indices.
   * @param {Number[]} indices - Tree indices.
   * @return {Buffer[]} - Multiproofs
   * @example
   * ```js
   *const indices = [2, 5, 6]
   *const proof = tree.getMultiProof(indices)
   *```
   */
  getMultiProof (tree?: any[], indices?: any[]):Buffer[] {
    if (!this.complete) {
      console.warn('Warning: For correct multiProofs it\'s strongly recommended to set complete: true')
    }

    if (!indices) {
      indices = tree
      tree = this.getLayersFlat()
    }

    const isUneven = this.isUnevenTree()
    if (isUneven) {
      if (indices.every(Number.isInteger)) {
        return this.getMultiProofForUnevenTree(indices)
      }
    }

    if (!indices.every(Number.isInteger)) {
      let els = indices
      if (this.sortPairs) {
        els = els.sort(Buffer.compare)
      }

      let ids = els.map((el) => this.bufferIndexOf(this.leaves, el, this.sortLeaves)).sort((a, b) => a === b ? 0 : a > b ? 1 : -1)
      if (!ids.every((idx) => idx !== -1)) {
        throw new Error('Element does not exist in Merkle tree')
      }

      const hashes = []
      const proof = []
      let nextIds = []

      for (let i = 0; i < this.layers.length; i++) {
        const layer = this.layers[i]
        for (let j = 0; j < ids.length; j++) {
          const idx = ids[j]
          const pairElement = this.getPairNode(layer, idx)

          hashes.push(layer[idx])
          if (pairElement) {
            proof.push(pairElement)
          }

          nextIds.push((idx / 2) | 0)
        }

        ids = nextIds.filter((value, i, self) => self.indexOf(value) === i)
        nextIds = []
      }

      return proof.filter((value) => !hashes.includes(value))
    }

    return this.getProofIndices(indices, Math.log2((tree.length / 2) | 0)).map(index => tree[index])
  }

  private getMultiProofForUnevenTree (tree?: any[], indices?: any[]):Buffer[] {
    if (!indices) {
      indices = tree
      tree = this.getLayers()
    }

    let proofHashes : Buffer[] = []
    let currentLayerIndices: number[] = indices
    for (const treeLayer of tree) {
      const siblings: Buffer[] = []
      for (const index of currentLayerIndices) {
        if (index % 2 === 0) {
          const idx = index + 1
          if (!currentLayerIndices.includes(idx)) {
            if (treeLayer[idx]) {
              siblings.push(treeLayer[idx])
              continue
            }
          }
        }
        const idx = index - 1
        if (!currentLayerIndices.includes(idx)) {
          if (treeLayer[idx]) {
            siblings.push(treeLayer[idx])
            continue
          }
        }
      }

      proofHashes = proofHashes.concat(siblings)
      const uniqueIndices = new Set<number>()

      for (const index of currentLayerIndices) {
        if (index % 2 === 0) {
          uniqueIndices.add(index / 2)
          continue
        }

        if (index % 2 === 0) {
          uniqueIndices.add((index + 1) / 2)
          continue
        }

        uniqueIndices.add((index - 1) / 2)
      }

      currentLayerIndices = Array.from(uniqueIndices)
    }

    return proofHashes
  }

  /**
   * getHexMultiProof
   * @desc Returns the multiproof for given tree indices as hex strings.
   * @param {Number[]} indices - Tree indices.
   * @return {String[]} - Multiproofs as hex strings.
   * @example
   * ```js
   *const indices = [2, 5, 6]
   *const proof = tree.getHexMultiProof(indices)
   *```
   */
  getHexMultiProof (tree: Buffer[] | string[], indices: number[]):string[] {
    return this.getMultiProof(tree, indices).map((x) => this.bufferToHex(x))
  }

  /**
   * getProofFlags
   * @desc Returns list of booleans where proofs should be used instead of hashing.
   * Proof flags are used in the Solidity multiproof verifiers.
   * @param {Number[]|Buffer[]} leaves
   * @param {Buffer[]} proofs
   * @return {Boolean[]} - Boolean flags
   * @example
   * ```js
   *const indices = [2, 5, 6]
   *const proof = tree.getMultiProof(indices)
   *const proofFlags = tree.getProofFlags(leaves, proof)
   *```
   */
  getProofFlags (leaves: any[], proofs: Buffer[] | string[]):boolean[] {
    if (!Array.isArray(leaves) || leaves.length <= 0) {
      throw new Error('Invalid Inputs!')
    }

    let ids : number[]
    if (leaves.every(Number.isInteger)) {
      ids = [...leaves].sort((a, b) => a === b ? 0 : a > b ? 1 : -1) // Indices where passed
    } else {
      ids = leaves.map((el) => this.bufferIndexOf(this.leaves, el, this.sortLeaves)).sort((a, b) => a === b ? 0 : a > b ? 1 : -1)
    }

    if (!ids.every((idx: number) => idx !== -1)) {
      throw new Error('Element does not exist in Merkle tree')
    }

    const _proofs: Buffer[] = (proofs as any[]).map(item => this.bufferify(item))

    const tested = []
    const flags = []
    for (let index = 0; index < this.layers.length; index++) {
      const layer = this.layers[index]
      ids = ids.reduce((ids, idx) => {
        const skipped = tested.includes(layer[idx])
        if (!skipped) {
          const pairElement = this.getPairNode(layer, idx)
          const proofUsed = _proofs.includes(layer[idx]) || _proofs.includes(pairElement)
          pairElement && flags.push(!proofUsed)
          tested.push(layer[idx])
          tested.push(pairElement)
        }
        ids.push((idx / 2) | 0)
        return ids
      }, [])
    }

    return flags
  }

  /**
   * verify
   * @desc Returns true if the proof path (array of hashes) can connect the target node
   * to the Merkle root.
   * @param {Object[]} proof - Array of proof objects that should connect
   * target node to Merkle root.
   * @param {Buffer} targetNode - Target node Buffer
   * @param {Buffer} root - Merkle root Buffer
   * @return {Boolean}
   * @example
   *```js
   *const root = tree.getRoot()
   *const proof = tree.getProof(leaves[2])
   *const verified = tree.verify(proof, leaves[2], root)
   *```
   */
  verify (proof: any[], targetNode: Buffer | string, root: Buffer | string):boolean {
    let hash = this.bufferify(targetNode)
    root = this.bufferify(root)

    if (
      !Array.isArray(proof) ||
      !targetNode ||
      !root
    ) {
      return false
    }

    for (let i = 0; i < proof.length; i++) {
      const node = proof[i]
      let data: any = null
      let isLeftNode = null

      // case for when proof is hex values only
      if (typeof node === 'string') {
        data = this.bufferify(node)
        isLeftNode = true
      } else if (Array.isArray(node)) {
        isLeftNode = (node[0] === 0)
        data = this.bufferify(node[1])
      } else if (Buffer.isBuffer(node)) {
        data = node
        isLeftNode = true
      } else if (node instanceof Object) {
        data = this.bufferify(node.data)
        isLeftNode = (node.position === 'left')
      } else {
        throw new Error('Expected node to be of type string or object')
      }

      const buffers: any[] = []

      if (this.isBitcoinTree) {
        buffers.push(reverse(hash))

        buffers[isLeftNode ? 'unshift' : 'push'](reverse(data))

        hash = this.hashFn(this.concatenator(buffers))
        hash = reverse(this.hashFn(hash))
      } else {
        if (this.sortPairs) {
          if (Buffer.compare(hash, data) === -1) {
            buffers.push(hash, data)
            hash = this.hashFn(this.concatenator(buffers))
          } else {
            buffers.push(data, hash)
            hash = this.hashFn(this.concatenator(buffers))
          }
        } else {
          buffers.push(hash)
          buffers[isLeftNode ? 'unshift' : 'push'](data)
          hash = this.hashFn(this.concatenator(buffers))
        }
      }
    }

    return Buffer.compare(hash, root) === 0
  }

  /**
   * verifyMultiProof
   * @desc Returns true if the multiproofs can connect the leaves to the Merkle root.
   * @param {Buffer} root - Merkle tree root
   * @param {Number[]} proofIndices - Leave indices for proof
   * @param {Buffer[]} proofLeaves - Leaf values at indices for proof
   * @param {Number} leavesCount - Count of original leaves
   * @param {Buffer[]} proof - Multiproofs given indices
   * @return {Boolean}
   * @example
   *```js
   *const leaves = tree.getLeaves()
   *const root = tree.getRoot()
   *const treeFlat = tree.getLayersFlat()
   *const leavesCount = leaves.length
   *const proofIndices = [2, 5, 6]
   *const proofLeaves = proofIndices.map(i => leaves[i])
   *const proof = tree.getMultiProof(treeFlat, indices)
   *const verified = tree.verifyMultiProof(root, proofIndices, proofLeaves, leavesCount, proof)
   *```
   */
  verifyMultiProof (root: Buffer | string, proofIndices: number[], proofLeaves: Buffer[] | string[], leavesCount: number, proof: Buffer[] | string[]):boolean {
    const isUneven = this.isUnevenTree()
    if (isUneven) {
      // TODO: combine these functions and simplify
      return this.verifyMultiProofForUnevenTree(root, proofIndices, proofLeaves, leavesCount, proof)
    }

    const depth = Math.ceil(Math.log2(leavesCount))
    root = this.bufferify(root)
    proofLeaves = (proofLeaves as any[]).map(leaf => this.bufferify(leaf))
    proof = (proof as any[]).map(leaf => this.bufferify(leaf))

    const tree = {}
    for (const [index, leaf] of this.zip(proofIndices, proofLeaves)) {
      tree[(2 ** depth) + index] = leaf
    }
    for (const [index, proofitem] of this.zip(this.getProofIndices(proofIndices, depth), proof)) {
      tree[index] = proofitem
    }
    let indexqueue = Object.keys(tree).map(value => +value).sort((a, b) => a - b)
    indexqueue = indexqueue.slice(0, indexqueue.length - 1)
    let i = 0
    while (i < indexqueue.length) {
      const index = indexqueue[i]
      if (index >= 2 && ({}).hasOwnProperty.call(tree, index ^ 1)) {
        let pair = [tree[index - (index % 2)], tree[index - (index % 2) + 1]]
        if (this.sortPairs) {
          pair = pair.sort(Buffer.compare)
        }

        const hash = pair[1] ? this.hashFn(this.concatenator(pair)) : pair[0]
        tree[(index / 2) | 0] = hash
        indexqueue.push((index / 2) | 0)
      }
      i += 1
    }
    return !proofIndices.length || (({}).hasOwnProperty.call(tree, 1) && tree[1].equals(root))
  }

  verifyMultiProofWithFlags (
    root: Buffer | string,
    leaves: TLeaf[],
    proofs: Buffer[] | string[],
    proofFlag: boolean[]
  ) {
    root = this.bufferify(root) as Buffer
    leaves = leaves.map(this.bufferify) as Buffer[]
    proofs = (proofs as any[]).map(this.bufferify) as Buffer[]
    const leavesLen = leaves.length
    const totalHashes = proofFlag.length
    const hashes : Buffer[] = []
    let leafPos = 0
    let hashPos = 0
    let proofPos = 0
    for (let i = 0; i < totalHashes; i++) {
      const bufA: Buffer = proofFlag[i] ? (leafPos < leavesLen ? leaves[leafPos++] : hashes[hashPos++]) : proofs[proofPos++]
      const bufB : Buffer = leafPos < leavesLen ? leaves[leafPos++] : hashes[hashPos++]
      const buffers = [bufA, bufB].sort(Buffer.compare)
      hashes[i] = this.hashFn(this.concatenator(buffers))
    }

    return Buffer.compare(hashes[totalHashes - 1], root) === 0
  }

  private verifyMultiProofForUnevenTree (root: Buffer | string, indices: number[], leaves: Buffer[] | string[], leavesCount: number, proof: Buffer[] | string[]):boolean {
    root = this.bufferify(root)
    leaves = (leaves as any[]).map(leaf => this.bufferify(leaf))
    proof = (proof as any[]).map(leaf => this.bufferify(leaf))

    const computedRoot = this.calculateRootForUnevenTree(indices, leaves, leavesCount, proof)
    return root.equals(computedRoot)
  }

  /**
   * getDepth
   * @desc Returns the tree depth (number of layers)
   * @return {Number}
   * @example
   *```js
   *const depth = tree.getDepth()
   *```
   */
  getDepth ():number {
    return this.getLayers().length - 1
  }

  /**
   * getLayersAsObject
   * @desc Returns the layers as nested objects instead of an array.
   * @example
   *```js
   *const layersObj = tree.getLayersAsObject()
   *```
   */
  getLayersAsObject ():any {
    const layers: any[] = this.getLayers().map((layer: any) => layer.map((value: any) => this.bufferToHex(value, false)))
    const objs = []
    for (let i = 0; i < layers.length; i++) {
      const arr = []
      for (let j = 0; j < layers[i].length; j++) {
        const obj = { [layers[i][j]]: null }
        if (objs.length) {
          obj[layers[i][j]] = {}
          const a = objs.shift()
          const akey = Object.keys(a)[0]
          obj[layers[i][j]][akey] = a[akey]
          if (objs.length) {
            const b = objs.shift()
            const bkey = Object.keys(b)[0]
            obj[layers[i][j]][bkey] = b[bkey]
          }
        }

        arr.push(obj)
      }

      objs.push(...arr)
    }

    return objs[0]
  }

  /**
   * verify
   * @desc Returns true if the proof path (array of hashes) can connect the target node
   * to the Merkle root.
   * @param {Object[]} proof - Array of proof objects that should connect
   * target node to Merkle root.
   * @param {Buffer} targetNode - Target node Buffer
   * @param {Buffer} root - Merkle root Buffer
   * @param {Function} hashFunction - Hash function for hashing leaves and nodes
   * @param {Object} options - Additional options
   * @return {Boolean}
   * @example
   *```js
   *const verified = MerkleTree.verify(proof, leaf, root, sha256, options)
   *```
   */
  static verify (proof: any[], targetNode: Buffer | string, root: Buffer | string, hashFn = SHA256, options: Options = {}):boolean {
    const tree = new MerkleTree([], hashFn, options)
    return tree.verify(proof, targetNode, root)
  }

  /**
   * getMultiProof
   * @desc Returns the multiproof for given tree indices.
   * @param {Buffer[]} tree - Tree as a flat array.
   * @param {Number[]} indices - Tree indices.
   * @return {Buffer[]} - Multiproofs
   *
   *@example
   * ```js
   *const flatTree = tree.getLayersFlat()
   *const indices = [2, 5, 6]
   *const proof = MerkleTree.getMultiProof(flatTree, indices)
   *```
   */
  static getMultiProof (tree: Buffer[] | string[], indices: number[]):Buffer[] {
    const t = new MerkleTree([])
    return t.getMultiProof(tree, indices)
  }

  /**
   * resetTree
   * @desc Resets the tree by clearing the leaves and layers.
   * @example
   *```js
   *tree.resetTree()
   *```
   */
  resetTree ():void {
    this.leaves = []
    this.layers = []
  }

  /**
   * getPairNode
   * @desc Returns the node at the index for given layer.
   * @param {Buffer[]} layer - Tree layer
   * @param {Number} index - Index at layer.
   * @return {Buffer} - Node
   *
   *@example
   * ```js
   *const node = tree.getPairNode(layer, index)
   *```
   */
  private getPairNode (layer: Buffer[], idx: number):Buffer {
    const pairIdx = idx % 2 === 0 ? idx + 1 : idx - 1

    if (pairIdx < layer.length) {
      return layer[pairIdx]
    } else {
      return null
    }
  }

  /**
   * toTreeString
   * @desc Returns a visual representation of the merkle tree as a string.
   * @return {String}
   * @example
   *```js
   *console.log(tree.toTreeString())
   *```
   */
  protected toTreeString ():string {
    const obj = this.getLayersAsObject()
    return treeify.asTree(obj, true)
  }

  /**
   * toString
   * @desc Returns a visual representation of the merkle tree as a string.
   * @example
   *```js
   *console.log(tree.toString())
   *```
   */
  toString ():string {
    return this.toTreeString()
  }

  isUnevenTree (treeLayers?: any[]) {
    const depth = treeLayers?.length || this.getDepth()
    return !this.isPowOf2(depth)
  }

  private isPowOf2 (v: number) {
    return v && !(v & (v - 1))
  }

  private calculateRootForUnevenTree (leafIndices: number[], leafHashes: any[], totalLeavesCount: number, proofHashes: any[]) {
    const leafTuples = this.zip(leafIndices, leafHashes).sort(([indexA], [indexB]) => indexA - indexB)
    const leafTupleIndices = leafTuples.map(([index]) => index)
    const proofIndices = this.getProofIndicesForUnevenTree(leafTupleIndices, totalLeavesCount)

    let nextSliceStart = 0
    const proofTuplesByLayers :any[] = []
    for (let i = 0; i < proofIndices.length; i++) {
      const indices = proofIndices[i]
      const sliceStart = nextSliceStart
      nextSliceStart += indices.length
      proofTuplesByLayers[i] = this.zip(indices, proofHashes.slice(sliceStart, nextSliceStart))
    }

    const tree = [leafTuples]
    for (let layerIndex = 0; layerIndex < proofTuplesByLayers.length; layerIndex++) {
      const currentLayer = proofTuplesByLayers[layerIndex].concat(tree[layerIndex]).sort(([indexA], [indexB]) => indexA - indexB)
        .map(([, hash]) => hash)

      const s = tree[layerIndex].map(([layerIndex]) => layerIndex)
      const parentIndices = [...new Set(s.map((index: any) => {
        if (index % 2 === 0) {
          return index / 2
        }

        if (index % 2 === 0) {
          return (index + 1) / 2
        }

        return (index - 1) / 2
      }))]

      const parentLayer: any[] = []
      for (let i = 0; i < parentIndices.length; i++) {
        const parentNodeTreeIndex = parentIndices[i]
        const bufA = currentLayer[i * 2]
        const bufB = currentLayer[i * 2 + 1]
        const hash = bufB ? this.hashFn(this.concatenator([bufA, bufB])) : bufA
        parentLayer.push([parentNodeTreeIndex, hash])
      }

      tree.push(parentLayer)
    }

    return tree[tree.length - 1][0][1]
  }
}

if (typeof window !== 'undefined') {
  ;(window as any).MerkleTree = MerkleTree
}



export default MerkleTree
export default MerkleSumTree
export default MerkleMountainRange
export default IncrementalMerkleTree
export default Base