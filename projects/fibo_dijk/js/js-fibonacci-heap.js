// helper functions I wrote
var instance;

// data structure for keeping track of parents / children
var node_rels = [[]];

function add_node(this_node, parent_node, child_node, next_node, prev_node) {
  node_rels.push([]);
  node_rels[this_node.value][0] = parent_node;
  node_rels[this_node.value][1] = child_node;
  node_rels[this_node.value][2] = next_node;
  node_rels[this_node.value][3] = prev_node;
}

function add_rel(node1, rel, node2) {
  if (node1 && node2) {
    if (rel == "parent") {
      if (node_rels[node1.value][0] != undefined) { // if parent exists
        remove_links_between(node1, node_rels[node1.value][0]) // remove it
      }
      node_rels[node1.value][0] = node2;
    }
    else if (rel == "child") {
      if (node_rels[node1.value][1] != undefined) {
        remove_links_between(node1, node_rels[node1.value][1])
      }
      node_rels[node1.value][1] = node2;
    }
    else if (rel == "next") {
      if (node_rels[node1.value][2] != undefined) {
        remove_links_between(node1, node_rels[node1.value][2])
      }
      node_rels[node1.value][2] = node2;
    }
    else if (rel == "prev") {
      if (node_rels[node1.value][3] != undefined) {
        remove_links_between(node1, node_rels[node1.value][3])
      }
      node_rels[node1.value][3] = node2;
    }
    var edges = instance.graph.getAllEdgesBetween({source: node1.value, target: node2.value});
    if (edges.length == 0) {
      edge = {source: node1.value, target: node2.value, directed: false};
      instance.graph.addEdge(edge);
    }
  }
}

function rem_rel(node1, rel) {
  if (node1 && node2) {
    var node2;
    if (rel == "parent") {
      node2 = node_rels[node1.value][0];
      node_rels[node1.value][0] = undefined;
    }
    else if (rel == "child") {
      node2 = node_rels[node1.value][1];
      node_rels[node1.value][1] = undefined;
    }
    else if (rel == "next") {
      node2 = node_rels[node1.value][2];
      node_rels[node1.value][2] = undefined;
    }
    else if (rel == "prev") {
      node2 = node_rels[node1.value][3];
      node_rels[node1.value][3] = undefined;
    }
    remove_links_between(node1, node2);
  }
}

function remove_links_between(node1, node2) {
  console.log("remove links betwen");
  var edges = instance.graph.getAllEdgesBetween({source: node1.value, target: node2.value});
  instance.graph.removeEdges(edges);
  instance.update();
}

function double_link(node1, node2) {
  console.log("double linking")
  var edge1 = { source: node1.value, target: node2.value, directed: false };
  var edge2 = { source: node2.value, target: node1.value, directed: false };
  instance.graph.addEdge(edge1);
  instance.graoh.addEdge(edge2);
  instance.update();
}

function point_min(node) {
  console.log("pointing min");
  var mins = instance.graph.getOutgoingEdges({id : "min"});
  console.log(mins);
  instance.graph.removeEdges(mins)
  var edge = { source: "min", target: node.value, directed: true };
  instance.graph.addEdge(edge);
  instance.update();
}

function update_key(node, new_key) {
  console.log("updating key");
  var update = instance.graph.getNode({ id: node.value });
  update.label = new_key;
  intance.update();
}
function mark_node(node) {
  console.log("marking node");
}




// The MIT License (MIT)
//
// Copyright (c) 2014 Daniel Imms, http://www.growingwiththeweb.com
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//
// Original code modified by Kennedy Bailey to implement greuler graph
// visualization
//


var nodes = [{id: "min"}] // makes min pointer possible
var links = [];

'use strict';


/**
 * Creates a Fibonacci heap.
 *
 * @constructor
 * @param {function} customCompare An optional custom node comparison
 * function.
 */
var FibonacciHeap = function (customCompare) {
  console.log("constructing heap");
  this.minNode = undefined;
  this.nodeCount = 0;

  instance = greuler({
    directed: false,
    target: "#fibonacci_ex",
    width: 600,
    data: {
      flowLayout: ['y', 30],
      nodes: nodes,
      links: links
    }
  }).update();// the greuler instance

  console.log(instance);
  if (customCompare) {
    this.compare = customCompare;
  }
};

/**
 * Clears the heap's data, making it an empty heap.
 */
FibonacciHeap.prototype.clear = function () {
  console.log("in clear");
  this.minNode = undefined;
  this.nodeCount = 0;
};

/**
 * Decreases a key of a node.
 *
 * @param {Node} node The node to decrease the key of.
 * @param {Object} newKey The new key to assign to the node.
 */
FibonacciHeap.prototype.decreaseKey = function (node, newKey) {
  if (typeof node === 'undefined') {
    throw new Error('Cannot decrease key of non-existent node');
  }
  if (this.compare({key: newKey}, {key: node.key}) > 0) {
    throw new Error('New key is larger than old key');
  }

  node.key = newKey;
  update_key(node, newKey);
  var parent = node.parent;
  if (parent && this.compare(node, parent) < 0) {
    // havent done anything here yet
    cut(node, parent, this.minNode, this.compare);
    cascadingCut(parent, this.minNode, this.compare);
  }
  if (this.compare(node, this.minNode) < 0) {
    point_min(node)
    this.minNode = node;
  }
};

/**
 * Deletes a node.
 *
 * @param {Node} node The node to delete.
 */
FibonacciHeap.prototype.delete = function (node) {
  // This is a special implementation of decreaseKey that sets the argument to
  // the minimum value. This is necessary to make generic keys work, since there
  // is no MIN_VALUE constant for generic types.
  var parent = node.parent;
  if (parent) {
    cut(node, parent, this.minNode, this.compare);
    cascadingCut(parent, this.minNode, this.compare);
  }
  this.minNode = node;
  point_min(node);
  this.extractMinimum();
};

/**
 * Extracts and returns the minimum node from the heap.
 *
 * @return {Node} node The heap's minimum node or undefined if the heap is
 * empty.
 */
FibonacciHeap.prototype.extractMinimum = function () {
  var extractedMin = this.minNode;
  if (extractedMin) {
    // Set parent to undefined for the minimum's children
    if (extractedMin.child) {
      var child = extractedMin.child;
      do {
        child.parent = undefined;
        child = child.next;
      } while (child !== extractedMin.child);
    }

    var nextInRootList;
    if (extractedMin.next !== extractedMin) {
      nextInRootList = extractedMin.next;
    }
    // Remove min from root list
    removeNodeFromList(extractedMin);
    this.nodeCount--;

    // Merge the children of the minimum node with the root list
    this.minNode = mergeLists(nextInRootList, extractedMin.child, this.compare);
    if (this.minNode) {
      this.minNode = consolidate(this.minNode, this.compare);
    }
  }
  return extractedMin;
};

/**
 * Returns the minimum node from the heap.
 *
 * @return {Node} node The heap's minimum node or undefined if the heap is
 * empty.
 */
FibonacciHeap.prototype.findMinimum = function () {
  return this.minNode;
};

/**
 * Inserts a new key-value pair into the heap.
 *
 * @param {Object} key The key to insert.
 * @param {Object} value The value to insert.
 * @return {Node} node The inserted node.
 */
FibonacciHeap.prototype.insert = function (key, value) {
  console.log("in insert")
  var node = new Node(key, value);
  var new_min = mergeLists(this.minNode, node, this.compare);
  this.minNode = new_min;
  point_min(new_min);
  this.nodeCount++;
  return node;
};

/**
 * @return {boolean} Whether the heap is empty.
 */
FibonacciHeap.prototype.isEmpty = function () {
  return this.minNode === undefined;
};

/**
 * @return {number} The size of the heap.
 */
FibonacciHeap.prototype.size = function () {
  if (this.isEmpty()) {
    return 0;
  }
  return getNodeListSize(this.minNode);
};

/**
 * Joins another heap to this heap.
 *
 * @param {FibonacciHeap} other The other heap.
 */
FibonacciHeap.prototype.union = function (other) {
  var new_min = mergeLists(this.minNode, other.minNode, this.compare);
  this.minNode = new_min;
  point_min(new_min)
  this.nodeCount += other.nodeCount;
};

/**
 * Compares two nodes with each other.
 *
 * @private
 * @param {Object} a The first key to compare.
 * @param {Object} b The second key to compare.
 * @return {number} -1, 0 or 1 if a < b, a == b or a > b respectively.
 */
FibonacciHeap.prototype.compare = function (a, b) {
  if (a.key > b.key) {
    return 1;
  }
  if (a.key < b.key) {
    return -1;
  }
  return 0;
};

/**
 * Creates an Iterator used to simplify the consolidate() method. It works by
 * making a shallow copy of the nodes in the root list and iterating over the
 * shallow copy instead of the source as the source will be modified.
 *
 * @private
 * @param {Node} start A node from the root list.
 */
var NodeListIterator = function (start) {
  this.index = -1;
  this.items = [];
  var current = start;
  do {
    this.items.push(current);
    current = current.next;
  } while (start !== current);
};

/**
 * @return {boolean} Whether there is a next node in the iterator.
 */
NodeListIterator.prototype.hasNext = function () {
  return this.index < this.items.length - 1;
};

/**
 * @return {Node} The next node.
 */
NodeListIterator.prototype.next = function () {
  return this.items[++this.index];
};

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
function cut(node, parent, minNode, compare) {

  node.parent = undefined;
  rem_rel(node, "parent");
  parent.degree--;
  if (node.next === node) {
    parent.child = undefined;
    rem_rel(parent, "child");
  } else {
    parent.child = node.next;
    add_rel(parent, "child", node.next);
  }
  removeNodeFromList(node);
  minNode = mergeLists(minNode, node, compare);
  node.isMarked = false;
  return minNode;
}

/**
 * Perform a cascading cut on a node; mark the node if it is not marked,
 * otherwise cut the node and perform a cascading cut on its parent.
 *
 * @private
 * @param {Node} node The node being considered to be cut.
 * @param {Node} minNode The minimum node in the root list.
 * @param {function} compare The node comparison function to use.
 * @return {Node} The heap's new minimum node.
 */
function cascadingCut(node, minNode, compare) {
  var parent = node.parent;
  if (parent) {
    if (node.isMarked) {
      minNode = cut(node, parent, minNode, compare);
      minNode = cascadingCut(parent, minNode, compare);
    } else {
      node.isMarked = true;

    }
  }
  return minNode;
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
function consolidate(minNode, compare) {
  var aux = [];
  var it = new NodeListIterator(minNode);
  while (it.hasNext()) {
    var current = it.next();

    // If there exists another node with the same degree, merge them
    while (aux[current.degree]) {
      if (compare(current, aux[current.degree]) > 0) {
        var temp = current;
        current = aux[current.degree];
        aux[current.degree] = temp;
      }
      linkHeaps(aux[current.degree], current, compare);
      aux[current.degree] = undefined;
      current.degree++;
    }

    aux[current.degree] = current;
  }

  minNode = undefined;
  for (var i = 0; i < aux.length; i++) {
    if (aux[i]) {
      // Remove siblings before merging
      aux[i].next = aux[i];
      aux[i].prev = aux[i];
      minNode = mergeLists(minNode, aux[i], compare);
    }
  }
  return minNode;
}

/**
 * Removes a node from a node list.
 *
 * @private
 * @param {Node} node The node to remove.
 */
function removeNodeFromList(node) {
  var prev = node.prev;
  var next = node.next;
  prev.next = next;
  add_rel(prev, "next", next);
  next.prev = prev;
  add_rel(next, "prev", prev);
  node.next = node;
  add_rel(node, "next", node);
  node.prev = node;
  add_rel(node, "prev", node);
}

/**
 * Links two heaps of the same order together.
 *
 * @private
 * @param {Node} max The heap with the larger root.
 * @param {Node} min The heap with the smaller root.
 * @param {function} compare The node comparison function to use.
 */
function linkHeaps(max, min, compare) {
  removeNodeFromList(max);
  min.child = mergeLists(max, min.child, compare);
  max.parent = min;
  max.isMarked = false;
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
function mergeLists(a, b, compare) {
  if (!a && !b) {
    return undefined;
  }
  if (!a) {
    return b;
  }
  if (!b) {
    return a;
  }

  var temp = a.next;
  add_rel(a, "next", b.next);
  a.next = b.next;
  add_rel(a.next, "prev", a);
  a.next.prev = a;
  add_rel(b, "next", temp);
  b.next = temp;
  add_rel(b.next, "prev", b)
  b.next.prev = b;

  return compare(a, b) < 0 ? a : b;
}

/**
 * Gets the size of a node list.
 *
 * @private
 * @param {Node} node A node within the node list.
 * @return {number} The size of the node list.
 */
function getNodeListSize(node) {
  var count = 0;
  var current = node;

  do {
    count++;
    if (current.child) {
      count += getNodeListSize(current.child);
    }
    current = current.next;
  } while (current !== node);

  return count;
}

/**
 * Creates a FibonacciHeap node.
 *
 * @constructor
 * @private
 */
function Node(key, value) {
  console.log("constructing node with key, value: " + key +" "+ value);
  instance.graph.addNode({id : value, label : key, topRightLabel: 0});
  instance.update();

  this.key = key;
  this.value = value;
  this.prev = this;
  this.next = this;
  this.degree = 0;

  this.parent = undefined;
  this.child = undefined;
  this.isMarked = undefined;

  add_node(this, undefined, undefined, undefined, undefined)
}
