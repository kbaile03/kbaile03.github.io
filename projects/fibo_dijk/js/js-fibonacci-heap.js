//  global vars
var instance
var nodeRels = [[]]
nodeRels[0] = [undefined, undefined, undefined, undefined, false]

var offsetSpace = 100
var gapSpace = 50

//  functions for heap formatting only
function levelize (nodeId, offset) {
  if (nodeRels[nodeId][4] === false) {
    nodeRels[nodeId][4] = true
    if (!offsetConstraintExists(nodeId, offset)) {
      constrainToLevel(nodeId, offset)
    }
    if (nodeRels[nodeId][3] !== undefined) {
      gapify(nodeId, nodeRels[nodeId][3].value)
      levelize(nodeRels[nodeId][3].value, offset)
    }
    if (nodeRels[nodeId][1] !== undefined) {
      levelize(nodeRels[nodeId][1].value, offset + offsetSpace)
    }
    if (nodeRels[nodeId][2] !== undefined) {
      levelize(nodeRels[nodeId][2].value, offset)
    }
  } else {
    //  console.log('nodeid was visited already: ' + nodeId)
  }
  instance.update()
}

function gapify (leftNodeId, rightNodeId) {
  var edges = instance.graph.getAllEdgesBetween({source: leftNodeId, target: rightNodeId})
  if (edges.length > 0 && !alignConstraintExists(leftNodeId, rightNodeId)) {
    pushLeft(leftNodeId, rightNodeId)
  }
}

function offsetConstraintExists (nodeId, offset) {
  try {
    if (instance.options.data.constraints[0]) {
      var obj
      var nodeInd = getIndex(nodeId)

      for (var i = 0; i < instance.options.data.constraints[0].offsets.length; i++) {
        obj = instance.options.data.constraints[0].offsets[i]
        if (obj.node === nodeInd) {
          if (obj.offset !== offset) {
            console.log('OFFSETS DO NOT MATCH: object offset' + obj.offset + 'when should be: ' + offset)
          }
          return true
        }
      }
    }
  } catch (err) {
    console.log('error checking offset constraints')
  }
}

function alignConstraintExists (leftNodeId, rightNodeId) {
  try {
    if (instance.options.data.constraints.length > 1) {
      var obj
      for (var j = 1; j < instance.options.data.constraints.length; j++) {
        obj = instance.options.data.constraints[j]
        if ((obj.left === leftNodeId && obj.right === rightNodeId) ||
            (obj.left === rightNodeId && obj.right === leftNodeId)) {
          return true
        }
      }
    }
  } catch (err) {
    console.log('error checking alignment constraints')
  }
}

function resetAllCons () {
  // console.log(nodeRels)
  // console.log(instance.options.data.constraints)
  try {
    if (instance.options.data.constraints[0]) {
      for (var i = 0; i < instance.options.data.constraints[0].offsets.length; i++) {
        instance.options.data.constraints[0].offsets.splice(i, 1)
        i--
      }
      instance.options.data.constraints[0].offsets.push({node: 0, offset: 0})
    }
    if (instance.options.data.constraints.length > 1) {
      for (var j = 1; j < instance.options.data.constraints.length; j++) {
        instance.options.data.constraints.splice(j, 1)
        j--
      }
    }
    resetVisited()
    instance.update()
  } catch (err) {
    console.log('error deleting all constraints')
  }
}

function resetVisited () {
  for (var i = 0; i < nodeRels.length; i++) {
    nodeRels[i][4] = false
  }
}

function constrainToLevel (nodeId, offset) {
  // console.log('pushing constraint' + getIndex(nodeId) + ' ' + offset)
  instance.options.data.constraints[0].offsets.push({node: getIndex(nodeId), offset: offset})
}

function pushLeft (leftId, rightId) {
  instance.options.data.constraints.push({axis: 'x', left: getIndex(leftId), right: getIndex(rightId), gap: gapSpace, equality: true})
}

function getIndex (nodeId) {
  var obj
  for (var i = 0; i < instance.options.data.nodes.length; i++) {
    obj = instance.options.data.nodes[i]
    if (obj.id === nodeId) {
      return i
    }
  }
  console.log('couldn\'t find index')
}

//  helper functions I wrote to interface with Greuler / Cola more easily

//  data structure for keeping track of parents / children

function addNode (thisNode, parentNode, childNode, nextNode, prevNode) {
  nodeRels.push([])
  nodeRels[thisNode.value][0] = parentNode
  nodeRels[thisNode.value][1] = childNode
  nodeRels[thisNode.value][2] = nextNode
  nodeRels[thisNode.value][3] = prevNode
  nodeRels[thisNode.value][4] = false
}

function deleteNode (node) {
  if (node) {
    console.log('deleting node: ' + node.key + ' ' + node.value)
    nodeRels[node.value] = [undefined, undefined, undefined, undefined, undefined]
    instance.graph.removeNode({ id: node.value })
  }
}

function setDegree (node, newDegree) {
  var update = instance.graph.getNode({ id: node.value })
  update.topRightLabel = newDegree
  instance.update()
}

function addRel (node1, rel, node2) {
  if (node1 && node2) {
    if (rel === 'parent') {
      if (nodeRels[node1.value][0] !== undefined) {
        removeLinksBetween(node1, nodeRels[node1.value][0])
      }
      nodeRels[node1.value][0] = node2
    } else if (rel === 'child') {
      if (nodeRels[node1.value][1] !== undefined) {
        removeLinksBetween(node1, nodeRels[node1.value][1])
      }
      nodeRels[node1.value][1] = node2
    } else if (rel === 'next') {
      if (nodeRels[node1.value][2] !== undefined) {
        removeLinksBetween(node1, nodeRels[node1.value][2])
      }
      nodeRels[node1.value][2] = node2
    } else if (rel === 'prev') {
      if (nodeRels[node1.value][3] !== undefined) {
        removeLinksBetween(node1, nodeRels[node1.value][3])
      }
      nodeRels[node1.value][3] = node2
    }
    var edges = instance.graph.getAllEdgesBetween({source: node1.value, target: node2.value})
    if (edges.length === 0) {
      var edge = {source: node1.value, target: node2.value, directed: false}
      instance.graph.addEdge(edge)
    }
    instance.update()
  }
}

function remRel (node1, rel) {
  if (node1) {
    var node2
    if (rel === 'parent') {
      node2 = nodeRels[node1.value][0]
      nodeRels[node1.value][0] = undefined
    } else if (rel === 'child') {
      node2 = nodeRels[node1.value][1]
      nodeRels[node1.value][1] = undefined
    } else if (rel === 'next') {
      node2 = nodeRels[node1.value][2]
      nodeRels[node1.value][2] = undefined
    } else if (rel === 'prev') {
      node2 = nodeRels[node1.value][3]
      nodeRels[node1.value][3] = undefined
    }
    removeLinksBetween(node1, node2)
  }
}

function removeLinksBetween (node1, node2) {
  var edges = instance.graph.getAllEdgesBetween({source: node1.value, target: node2.value})
  instance.graph.removeEdges(edges)
}

function pointMin (node) {
  var mins = instance.graph.getOutgoingEdges({id: 0})
  if (nodeRels[0][1] !== undefined) {
    //  TODO DO I HANDLE PARENTAL CHANGES? probably because the min is fake
  }
  nodeRels[0][1] = node
  instance.graph.removeEdges(mins)
  if (node) {
    var edge = { source: 0, target: node.value, directed: true }
    instance.graph.addEdge(edge)
    instance.update()
  }
}

function updateKey (node, newKey) {
  var update = instance.graph.getNode({id: node.value})
  update.label = newKey
  instance.update()
}

function markNode (node) {
  var update = instance.graph.getNode({id: node.value})
  update.fill = markedColor
}
function unmarkNode (node) {
  var update = instance.graph.getNode({id: node.value})
  update.fill = defaultColor
}

//  The MIT License (MIT)
//
//  Copyright (c) 2014 Daniel Imms, http:// www.growingwiththeweb.com
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.
//
//  Original code modified by Kennedy Bailey to implement greuler graph
//  visualization
//

var nodes = [{id: 0, label: 'min', fill: '#654c4f'}] //  id 0 will always be the min ptr
var links = []
var defaultColor = '#2980B9'
var markedColor = 'red'
'use strict'

/**
 * Creates a Fibonacci heap.
 *
 * @constructor
 * @param {string} div the div name
 * @param {int} height the svg height
 * @param {int} width the svg width
 * @param {function} customCompare An optional custom node comparison
 * function.
 */
var FibonacciHeap = function (div, height, width, customCompare) {
  this.minNode = undefined
  this.nodeCount = 0

  instance = greuler({
    directed: false,
    target: '#' + div,
    width: width,
    height: height,
    data: {
      flowLayout: ['y', -1],
      nodes: nodes,
      links: links,
      constraints: [
        {
          type: 'alignment',
          axis: 'y',
          offsets: [{node: 0, offset: 0}]
        },
        {
          axis: 'x',
          left: 0,
          right: 0,
          gap: 0
        }
      ]
    }
  }).update()//  the greuler instance

  console.log(instance.layout.linkDistance(10))


  if (customCompare) {
    this.compare = customCompare
  }
}

/**
 * Clears the heap's data, making it an empty heap.
 */
FibonacciHeap.prototype.clear = function () {
  this.minNode = undefined

  nodeRels = [[]]
  nodeRels[0] = [undefined, undefined, undefined, undefined]
  this.nodeCount = 0
}

/**
 * Decreases a key of a node.
 *
 * @param {Node} node The node to decrease the key of.
 * @param {Object} newKey The new key to assign to the node.
 */
FibonacciHeap.prototype.decreaseKey = function (node, newKey) {
  if (typeof node === 'undefined') {
    throw new Error('Cannot decrease key of non-existent node')
  }
  if (this.compare({key: newKey}, {key: node.key}) > 0) {
    throw new Error('New key is larger than old key')
  }

  node.key = newKey
  updateKey(node, newKey)
  var parent = node.parent
  if (parent && this.compare(node, parent) < 0) {
    //  havent done anything here yet
    cut(node, parent, this.minNode, this.compare)
    cascadingCut(parent, this.minNode, this.compare)
  }
  if (this.compare(node, this.minNode) < 0) {
    pointMin(node)
    this.minNode = node
  }
}


FibonacciHeap.prototype.getNodeFromRels = function (nodeId) {
  var i = 0
  var j = 1
  var obj
  var found = false
  // console.log('id ' + nodeId)
  // console.log('length ' + nodeRels.length)
  while (!found && i < nodeRels.length) {
    while (!found && j < 4) {
      // console.log(i + ' ' + j)
      obj = nodeRels[i][j]
      // console.log(obj)
      if (obj) {
        if (obj.key === nodeId) {
          found = true
          return obj
        }
      }
      j++
    }
    i++
    j = 0
  }
}

FibonacciHeap.prototype.deleteTranslate = function (nodeId) {
  console.log('nodeId to delete ' + nodeId)
  return this.delete(this.getNodeFromRels(nodeId))
}

FibonacciHeap.prototype.decreaseKeyTranslate = function (nodeId, key) {
  this.decreaseKey(this.getNodeFromRels(nodeId), key)
}

/**
 * Deletes a node.
 *
 * @param {Node} node The node to delete.
 */
FibonacciHeap.prototype.delete = function (node) {
console.log('in delete')
  //  This is a special implementation of decreaseKey that sets the argument to
  //  the minimum value. This is necessary to make generic keys work, since there
  //  is no MIN_VALUE constant for generic types.
  var parent = node.parent
  if (parent) {
    cut(node, parent, this.minNode, this.compare)
    cascadingCut(parent, this.minNode, this.compare)
  }
  this.minNode = node
  pointMin(node)
  return this.extractMinimum()
}

/**
 * Extracts and returns the minimum node from the heap.
 *
 * @return {Node} node The heap's minimum node or undefined if the heap is
 * empty.
 */
FibonacciHeap.prototype.extractMinimum = function () {
  var extractedMin = this.minNode
  if (extractedMin) {
    //  Set parent to undefined for the minimum's children
    if (extractedMin.child) {
      var child = extractedMin.child
      do {
        remRel(child, 'parent')
        child.parent = undefined
        addRel(extractedMin, 'child', child.next)
        child = child.next
      } while (child !== extractedMin.child)
    }

    var nextInRootList
    if (extractedMin.next !== extractedMin) {
      nextInRootList = extractedMin.next
    }
    console.log('remove node from list: ' + extractedMin.key + ' ' + extractedMin.value)
    removeNodeFromList(extractedMin)
    this.nodeCount--
    //  Merge the children of the minimum node with the root list
    var newMin = mergeLists(nextInRootList, extractedMin.child, this.compare)
    this.minNode = newMin
    pointMin(newMin)
    if (this.minNode) {
      newMin = consolidate(this.minNode, this.compare)
      this.minNode = newMin
      pointMin(newMin)
    }
  }
  return extractedMin
}

/**
 * Returns the minimum node from the heap.
 *
 * @return {Node} node The heap's minimum node or undefined if the heap is
 * empty.
 */
FibonacciHeap.prototype.findMinimum = function () {
  return this.minNode
}

/**
 * Inserts a new key-value pair into the heap.
 *
 * @param {Object} key The key to insert.
 * @param {Object} value The value to insert.
 * @param {string} color the node color
 * @return {Node} node The inserted node.
 */
FibonacciHeap.prototype.insert = function (key, value, color) {
  var node = new Node(key, value, color)
  var newMin = mergeLists(this.minNode, node, this.compare)
  this.minNode = newMin
  pointMin(newMin)
  this.nodeCount++
  return node
}

/**
 * @return {boolean} Whether the heap is empty.
 */
FibonacciHeap.prototype.isEmpty = function () {
  return this.minNode === undefined
}

/**
 * @return {number} The size of the heap.
 */
FibonacciHeap.prototype.size = function () {
  if (this.isEmpty()) {
    return 0
  }
  return getNodeListSize(this.minNode)
}

/**
 * Joins another heap to this heap.
 *
 * @param {FibonacciHeap} other The other heap.
 */
FibonacciHeap.prototype.union = function (other) {
  var newMin = mergeLists(this.minNode, other.minNode, this.compare)
  this.minNode = newMin
  pointMin(newMin)
  this.nodeCount += other.nodeCount
}

/**
 * Compares two nodes with each other.
 *
 * @private
 * @param {Object} a The first key to compare.
 * @param {Object} b The second key to compare.
 * @return {number} -1, 0 or 1 if a < b, a === b or a > b respectively.
 */
FibonacciHeap.prototype.compare = function (a, b) {
  if (a.key > b.key) {
    return 1
  }
  if (a.key < b.key) {
    return -1
  }
  return 0
}

/**
 * Creates an Iterator used to simplify the consolidate() method. It works by
 * making a shallow copy of the nodes in the root list and iterating over the
 * shallow copy instead of the source as the source will be modified.
 *
 * @private
 * @param {Node} start A node from the root list.
 */
var NodeListIterator = function (start) {
  this.index = -1
  this.items = []
  var current = start
  do {
    this.items.push(current)
    current = current.next
  } while (start !== current)
}

/**
 * @return {boolean} Whether there is a next node in the iterator.
 */
NodeListIterator.prototype.hasNext = function () {
  return this.index < this.items.length - 1
}

/**
 * @return {Node} The next node.
 */
NodeListIterator.prototype.next = function () {
  return this.items[++this.index]
}

/**
 * Cut the link between a node and its parent, moving the node to the root list.
 *
 * @private
 * @param {Node} node The node being cut.
 * @param {Node} parent The parent of the node being cut.
 * @param {Node} minNode The minimum node in the root list.
 * @param {function} compare The node comparison function to use.
 * @return {Node} The heap's new minimum node.
 */
function cut (node, parent, minNode, compare) {
  remRel(node, 'parent')
  node.parent = undefined

  parent.degree--
  setDegree(parent, parent.degree)
  if (node.next === node) {
    remRel(parent, 'child')
    parent.child = undefined
  } else {
    addRel(parent, 'child', node.next)
    parent.child = node.next
  }
  removeNodeFromList(node)
  minNode = mergeLists(minNode, node, compare)
  node.isMarked = false
  unmarkNode(node)
  return minNode
}

/**
 * Perform a cascading cut on a node mark the node if it is not marked,
 * otherwise cut the node and perform a cascading cut on its parent.
 *
 * @private
 * @param {Node} node The node being considered to be cut.
 * @param {Node} minNode The minimum node in the root list.
 * @param {function} compare The node comparison function to use.
 * @return {Node} The heap's new minimum node.
 */
function cascadingCut (node, minNode, compare) {
  var parent = node.parent
  if (parent) {
    if (node.isMarked) {
      minNode = cut(node, parent, minNode, compare)
      minNode = cascadingCut(parent, minNode, compare)
    } else {
      node.isMarked = true
      markNode(node)
    }
  }
  return minNode
}

/**
 * Merge all trees of the same order together until there are no two trees of
 * the same order.
 *
 * @private
 * @param {Node} minNode The current minimum node.
 * @param {function} compare The node comparison function to use.
 * @return {Node} The new minimum node.
 */
function consolidate (minNode, compare) {
  var aux = []
  var it = new NodeListIterator(minNode)
  while (it.hasNext()) {
    var current = it.next()

    //  If there exists another node with the same degree, merge them
    while (aux[current.degree]) {
      if (compare(current, aux[current.degree]) > 0) {
        var temp = current
        current = aux[current.degree]
        aux[current.degree] = temp//  TODO: may or may not need to do something with this
      }
      linkHeaps(aux[current.degree], current, compare)
      aux[current.degree] = undefined
      current.degree++
      setDegree(current, current.degree)
    }
    aux[current.degree] = current
  }

  minNode = undefined
  for (var i = 0; i < aux.length; i++) {
    if (aux[i]) {
      //  Remove siblings before merging
      addRel(aux[i], 'next', aux[i])
      aux[i].next = aux[i]
      addRel(aux[i], 'prev', aux[i])
      aux[i].prev = aux[i]
      minNode = mergeLists(minNode, aux[i], compare)
    }
  }
  return minNode
}

/**
 * Removes a node from a node list.
 *
 * @private
 * @param {Node} node The node to remove.
 */
function removeNodeFromList (node) {
  var prev = node.prev
  var next = node.next
  addRel(prev, 'next', next)
  prev.next = next
  addRel(next, 'prev', prev)
  next.prev = prev
  addRel(node, 'next', node)
  node.next = node
  addRel(node, 'prev', node)
  node.prev = node
}

/**
 * Links two heaps of the same order together.
 *
 * @private
 * @param {Node} max The heap with the larger root.
 * @param {Node} min The heap with the smaller root.
 * @param {function} compare The node comparison function to use.
 */
function linkHeaps (max, min, compare) {
  removeNodeFromList(max)
  var newMin = mergeLists(max, min.child, compare)
  addRel(min, 'child', newMin)
  min.child = newMin
  addRel(max, 'parent', min)
  max.parent = min
  max.isMarked = false
  unmarkNode(max)
}

/**
 * Merge two lists of nodes together.
 *
 * @private
 * @param {Node} a The first list to merge.
 * @param {Node} b The second list to merge.
 * @param {function} compare The node comparison function to use.
 * @return {Node} The new minimum node from the two lists.
 */
function mergeLists (a, b, compare) {
  if (!a && !b) {
    return undefined
  }
  if (!a) {
    return b
  }
  if (!b) {
    return a
  }

  var temp = a.next
  addRel(a, 'next', b.next)
  a.next = b.next
  addRel(a.next, 'prev', a)
  a.next.prev = a
  addRel(b, 'next', temp)
  b.next = temp
  addRel(b.next, 'prev', b)
  b.next.prev = b
  var lesser = compare(a, b) < 0 ? a : b
  return lesser
}

/**
 * Gets the size of a node list.
 *
 * @private
 * @param {Node} node A node within the node list.
 * @return {number} The size of the node list.
 */
function getNodeListSize (node) {
  var count = 0
  var current = node

  do {
    count++
    if (current.child) {
      count += getNodeListSize(current.child)
    }
    current = current.next
  } while (current !== node)

  return count
}

/**
 * Creates a FibonacciHeap node.
 *
 * @constructor
 * @private
 */
function Node (key, value, color) {
  instance.graph.addNode({id: value, label: key, topRightLabel: 0, fill: color})
  console.log("inserted as")
  console.log(value)
  this.key = key
  this.value = value
  this.prev = this
  this.next = this
  this.degree = 0

  this.parent = undefined
  this.child = undefined
  this.isMarked = undefined

  addNode(this, undefined, undefined, this, this)
  instance.update()
}
