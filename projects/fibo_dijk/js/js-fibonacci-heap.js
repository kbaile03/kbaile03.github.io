//global vars
var instance;
var node_rels = [[]];
    node_rels[0] = [undefined, undefined, undefined, undefined, false]

var offset_space = 50;

// functions for heap formatting only
function levelize(nodeId, offset) {
  console.log("nodeId: ")
  console.log(nodeId)

  if (node_rels[nodeId][4] == false) {
    console.log("hello sister")
    node_rels[nodeId][4] = true
    if (!constraintExists(nodeId, offset)) {
      constrainToLevel(nodeId, offset);
    }
    if (node_rels[nodeId][3] != undefined) {
        console.log("1")
        levelize(node_rels[nodeId][3].value, offset)
    }
    if (node_rels[nodeId][1] != undefined) {
      console.log("2")
        levelize(node_rels[nodeId][1].value, offset + offset_space)
    }
    if (node_rels[nodeId][2] != undefined) {
      console.log("3")
        gapify(nodeId, node_rels[nodeId][2].value)
        levelize(node_rels[nodeId][2].value, offset)
    }
  } else {
    console.log("nodeid was visited already: " + nodeId)
  }
  instance.update();
}

function gapify(leftNodeId, rightNodeId) {
  var edges = instance.graph.getAllEdgesBetween({source: leftNodeId, target: rightNodeId});
  if (edges.length > 0) {
    pushLeft(rightNodeId, leftNodeId)
  }
}

function constraintExists(nodeId, offset) {
  try {
    console.log(instance.options.data.constraints)
    if (instance.options.data.constraints[0]) {
      var obj;
      var nodeInd = getIndex(nodeId)

      for(var i = 0; i < instance.options.data.constraints[0].offsets.length; i++) {
        obj = instance.options.data.constraints[0].offsets[i];
        console.log("CONSTRAINT")
        console.log(obj)
        if (obj.node == nodeInd) {
          if(obj.offset != offset) {
            console.log("OFFSETS DO NOT MATCH: object offset" + obj.offset + "when should be: " + offset)
          }
          return true;
        }
      }
    }
  }
  catch(err) {
    console.log("error checking constraints")
  }
}


function resetAllCons() {
//  try {
    if (instance.options.data.constraints[0]) {
      console.log("resetting offsets")
      var obj;
      for(var i = 0; i < instance.options.data.constraints[0].offsets.length; i++) {
        instance.options.data.constraints[0].offsets.splice(i, 1)
        i--;
      }
      instance.options.data.constraints[0].offsets.push({node: 0, offset: 0})
      console.log(instance.options.data.constraints[0].offsets)
    }
    if (instance.options.data.constraints.length > 1) {
      var obj;
      for(var i = 1; i < instance.options.data.constraints.length; i++) {
        instance.options.data.constraints.splice(i, 1)
        i--;
      }
    }
    resetVisited();
    instance.update();
  // } catch(err) {
  //   console.log("error deleting all constraints")
  // }
}

function resetVisited () {
  for (var i = 0; i < node_rels.length; i++) {
    node_rels[i][4] = false
  }
}

function constrainToLevel(nodeId, offset) {
  console.log("pushing constraint" + getIndex(nodeId) + " " + offset);
  instance.options.data.constraints[0].offsets.push({node: getIndex(nodeId), offset: offset});
}

function pushLeft(leftId, rightId) {
  console.log("pushing left")
  instance.options.data.constraints.push({axis:"x", left:getIndex(leftId), right:getIndex(rightId), gap:25})
}

function getIndex(nodeId) {
  console.log("getting index")
  var obj;
  for(var i = 0; i < instance.options.data.nodes.length; i++) {
    obj = instance.options.data.nodes[i];
    if (obj.id == nodeId) {
      console.log("actual index: " + i)
      return i;
    }
  }
  console.log("couldn't find index")
}


// helper functions I wrote to interface with Greuler / Cola more easily


// data structure for keeping track of parents / children


function add_node(this_node, parent_node, child_node, next_node, prev_node) {
 //console.log("THIS NEW NODE HAS A NICE VALUE");
 //console.log(this_node.value)
  node_rels.push([]);
  node_rels[this_node.value][0] = parent_node;
  node_rels[this_node.value][1] = child_node;
  node_rels[this_node.value][2] = next_node;
  node_rels[this_node.value][3] = prev_node;
  node_rels[this_node.value][4] = false;
}

// function getIndex(node) {
//  //console.log("getting indices:")
//   var obj;
//   for(var i = 0; i < instance.options.data.nodes.length; i++) {
//     obj = instance.options.data.nodes[i];
//    //console.log(obj)
//     if (obj.id == node.value) {
//      //console.log("matched id returning index: " + i)
//       return i;
//     }
//   }
// }

function delete_node(node) {
  console.log("deleting node: " + node.key + " " + node.value)
  //remove_all_constraints(getIndex(node.value))
  node_rels[node.value] = undefined;
  instance.graph.removeNode({ id: node.value });
}

function set_degree(node, new_degree) {
  var update = instance.graph.getNode({ id: node.value });
  update.topRightLabel = new_degree;
  instance.update();
}

// function remove_horz_constraint(node1, node2) {
//   console.log("deconstraining H at: " + node1.value + " " + node2_id)
//   var index1 = instance.options.data.constraints.indexOf({axis: "x", left: node1_id, right: node2_id, gap: 0})
//   var index2 = instance.options.data.constraints.indexOf({axis: "x", left: node2_id, right: node1_id, gap: 0})
//   instance.options.data.constraints.splice(index1, 1);
//   instance.options.data.constraints.splice(index2, 1);
//   instance.update();
// }

// function remove_vert_constraint(node1_id, node2_id) {
//   //console.log("deconstraining V at: " + node1_id + " " + node2_id)
//   var obj;
//   for(var i = 0; i < instance.options.data.constraints.length; i++) {
//     obj = instance.options.data.constraints[i];
//     //console.log(obj)
//     if ((obj.axis == "y" && obj.left == node1_id && obj.right == node2_id) || (obj.axis == "y" && obj.left == node2_id && obj.right == node1_id)) {
//       //console.log("here")
//       instance.options.data.constraints.splice(i, 1)
//       i--;
//     }
//   }
//
//   // console.log("deconstraining V at: " + node1_id + " " + node2_id)
//   // var index1 = instance.options.data.constraints.indexOf({axis: "y", left: node1_id, right: node2_id, gap: 0})
//   // var index2 = instance.options.data.constraints.indexOf({axis: "y", left: node2_id, right: node1_id, gap: 0})
//   // console.log("indices: " + index1 + " " + index2)
//   // console.log(instance.options.data.constraints.splice(index1, 1));
//   // console.log(instance.options.data.constraints.splice(index2, 1));
//   // instance.update();
// }


// function remove_all_constraints(node1_ind) {
//   //console.log("deconstraining H at: " + node1_id + " " + node2_id)
//   var obj;
//   for(var i = 0; i < instance.options.data.constraints.length; i++) {
//     obj = instance.options.data.constraints[i];
//     //console.log(obj)
//     if (obj.left == node1_ind || obj.right == node1_ind) {
//       //console.log("HERE")
//       instance.options.data.constraints.splice(i, 1)
//       i--;
//     }
//   }
// }

// function remove_constraint(axis, node1_ind, node2_ind, gap) {
//   //console.log("deconstraining H at: " + node1_id + " " + node2_id)
//   var obj;
//   for(var i = 0; i < instance.options.data.constraints.length; i++) {
//     obj = instance.options.data.constraints[i];
//     //console.log(obj)
//     if (obj.axis == axis && obj.left == node1_ind && obj.right == node2_ind && obj.gap == gap) {
//       //console.log("HERE")
//       instance.options.data.constraints.splice(i, 1)
//       i--;
//     }
//   }
// }


// function constrain_horz(node1, node2) {
//   if (node1.value != node2.value) {
//     //console.log("constraining H at: " + node1.value + " " + node2.value)
//     instance.options.data.constraints.push({axis: "x", left: getIndex(node1), right: getIndex(node2), gap: 100});
//     instance.options.data.constraints.push({axis: "x", left: getIndex(node2), right: getIndex(node1), gap: 100});
//   }
// }
//
// function constrain_vert(node1, node2) {
//   if (node1.value != node2.value) {
//     //console.log("constraining V at: " + node1.value + " " + node2.value)
//     instance.options.data.constraints.push({axis: "y", left: getIndex(node1), right: getIndex(node2), gap: 0});
//     instance.options.data.constraints.push({axis: "y", left: getIndex(node2), right: getIndex(node1), gap: 0});
//   }
// }

// function constraint_clean(node1, rel_id) {
//
//   var node1_ind = getIndex(node1)
//   var ind = getIndex(node_rels[node1.value][rel_id].value)
//   remove_all_constraints()
//   // remove_constraint("y", node1_ind, ind, 0);
//   // remove_constraint("y", ind, node1_ind, 0);
//   // remove_constraint("x", node1_ind, ind, 1);
//   // remove_constraint("x", ind, node1_ind, 1);
//
// }

function add_rel(node1, rel, node2) {
  if (node1 && node2) {
    if (rel == "parent") {
      if (node_rels[node1.value][0] != undefined) {
        //constraint_clean(node1, 0)
        remove_links_between(node1, node_rels[node1.value][0])
      }
      node_rels[node1.value][0] = node2;
      //constrain_horz(node1, node2);
    }
    else if (rel == "child") {
      if (node_rels[node1.value][1] != undefined) {
       //console.log("ENTERED CHILD: here are node1 key and value, and node_rels[node1.value][1] key and value: ")
       //console.log(node1.key + " " + node1.value)
       //console.log(node_rels[node1.value][1].key + " " + node_rels[node1.value][1].value)
        //constraint_clean(node1, 1)
        remove_links_between(node1, node_rels[node1.value][1])
      }
      node_rels[node1.value][1] = node2;
      //constrain_horz(node1, node2);
    }
    else if (rel == "next") {
     //console.log("NEXT")
      if (node_rels[node1.value][2] != undefined) {
        //constraint_clean(node1, 2)
        remove_links_between(node1, node_rels[node1.value][2])
      }
      node_rels[node1.value][2] = node2;
      //constrain_vert(node1, node2);
      //instance.options.data.constraints.push({axis: "x", left: getIndex(node1), right: getIndex(node2), gap: 1});
    }
    else if (rel == "prev") {
     //console.log("PREV")
      if (node_rels[node1.value][3] != undefined) {
        //constraint_clean(node1, 3)
        remove_links_between(node1, node_rels[node1.value][3])

      }
      node_rels[node1.value][3] = node2;
      //constrain_vert(node1, node2);
      //instance.options.data.constraints.push({axis: "x", left: node2.value, right: node1.value, gap: 1});
      //console.log(instance.options.data.constraints);

    }
    var edges = instance.graph.getAllEdgesBetween({source: node1.value, target: node2.value});
    if (edges.length == 0) {
      edge = {source: node1.value, target: node2.value, directed: false};
      instance.graph.addEdge(edge);
    }
   //console.log("HERE ARE THE CONSTRAINTS:")
   //console.log(instance.options.data.constraints)
    instance.update();
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
  var edges = instance.graph.getAllEdgesBetween({source: node1.value, target: node2.value});
  instance.graph.removeEdges(edges);
}

function assign(node1, node2) {
  if(node1 != undefined) {
  console.log("assigning: ")
  console.log(node1)
  console.log(node2)
  var update1 = instance.graph.getNode({id: node1.value })
  var update2 = instance.graph.getNode({id: node2.value })
  var id1 = update1.id
  var lab1 = update1.label
  var trl1 = update1.topRightLabel

  update1.id = update2.id
  //update1.label = update2.label
  update1.topRightLabel = update2.topRightLabel

  update2.id = id1
  //update2.label = lab1
  update2.topRightLabel = trl1
  //TODO might need to update node_rels
  instance.update()
}
}


function point_min(node) {
  var mins = instance.graph.getOutgoingEdges({id : 0});
 //console.log("mins:");
 //console.log(mins);
  if (node_rels[0][1] != undefined) {
    // TODO DO I HANDLE PARENTAL CHANGES? probably because the min is fake

    //node_rels[node_rels[0][1].value]
    //remove_constraint("x", 0, node_rels[0][1].value, 0);
    //remove_constraint("x", node_rels[0][1].value, 0, 0);
  }
 //console.log(node_rels);
 //console.log(instance.options.data.nodes)
  instance.graph.removeEdges(mins)
  if (node) {
   //console.log("pointing min to: " + node.key + " " + node.value)
    var edge = { source: 0, target: node.value, directed: true };
    node_rels[0][1] = node;
    //instance.options.data.constraints.push({axis: "x", left: 0, right: getIndex(node), gap: 0});
    //instance.options.data.constraints.push({axis: "x", left: getIndex(node), right: 0, gap: 0});
    instance.graph.addEdge(edge);
    instance.update();
  }
}

function update_key(node, new_key) {
  var update = instance.graph.getNode({ id: node.value });
  update.label = new_key;
  intance.update();
}

function mark_node(node) {
  var update = instance.graph.getNode({ id : node.vaue });
  update.fill = marked_color;
}
function unmark_node(node) {
  var update = instance.graph.getNode({ id: node.value});
  update.fill = default_color;
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


var nodes = [{id: 0, label : "min"}] // id 0 will always be the min ptr
var links = [];
var default_color = "#2980B9"
var marked_color = "red"
'use strict';


/**
 * Creates a Fibonacci heap.
 *
 * @constructor
 * @param {function} customCompare An optional custom node comparison
 * function.
 */
var FibonacciHeap = function (customCompare) {
 //console.log("constructing heap");
  this.minNode = undefined;
  this.nodeCount = 0;

  instance = greuler({
    directed: false,
    target: "#fibonacci_ex",
    width: 600,
    data: {
      flowLayout: ['y', 30],
      nodes: nodes,
      links: links,
      constraints: [
        {
          type: "alignment",
          axis: "y",
          offsets: [{node: 0, offset: 0}]
        },
        {
          axis : "x",
          left : 0,
          right : 0,
          gap: 0
        }
      ]
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
 //console.log("in clear");
  this.minNode = undefined;

  node_rels = [[]]
  node_rels[0] = [undefined, undefined, undefined, undefined]
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
 //console.log("HELLO");
  var extractedMin = this.minNode;
  if (extractedMin) {
    // Set parent to undefined for the minimum's children
    if (extractedMin.child) {
      var child = extractedMin.child;
      do {
        rem_rel(child, "parent");
        child.parent = undefined;
        add_rel(extractedMin, "child", child.next);
        child = child.next;
      } while (child !== extractedMin.child);
    }

    var nextInRootList;
    if (extractedMin.next !== extractedMin) {
      nextInRootList = extractedMin.next;
    }
   //console.log("HELLO1")
    // Remove min from root list
    console.log("remove node from list: " + extractedMin.key + " " + extractedMin.value)
    removeNodeFromList(extractedMin);
    this.nodeCount--;
    console.log("before merge")
    console.log(node_rels)
    // Merge the children of the minimum node with the root list
    var new_min = mergeLists(nextInRootList, extractedMin.child, this.compare);
    this.minNode = new_min;
    console.log("NEW MIN MERGE")
    //console.log(new_min.key)
    point_min(new_min);
    if (this.minNode) {

      new_min = consolidate(this.minNode, this.compare);
      console.log("NEW MIN CONSOLIDATE")
      console.log(new_min.key)
      this.minNode = new_min;
      point_min(new_min);
    }
  }
  console.log("NODE RELS")
  console.log(node_rels)
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
 console.log("THE NODE RELS:")
  console.log(node_rels);

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
  console.log("comparing: " + a.key + " " + b.key)
  if (a.key > b.key) {
    console.log(a.key + " is greater than " + b.key)
    return 1;
  }
  if (a.key < b.key) {
    console.log(b.key + " is greater than " + a.key)
    return -1;
  }
  console.log(b.key + " equals " + a.key)
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
  rem_rel(node, "parent");
  node.parent = undefined;

  parent.degree--;
  set_degree(parent, parent.degree);
  if (node.next === node) {
    rem_rel(parent, "child");
    parent.child = undefined;
  } else {
    add_rel(parent, "child", node.next);
    parent.child = node.next;
  }
  removeNodeFromList(node);
  minNode = mergeLists(minNode, node, compare);
  node.isMarked = false;
  unmark_node(node);
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
      mark_node(node);
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
  console.log("consolidating")
  console.log(node_rels)
  var aux = [];
  var it = new NodeListIterator(minNode);
  while (it.hasNext()) {
    var current = it.next();

    // If there exists another node with the same degree, merge them
    while (aux[current.degree]) {
      console.log("current degree: " + current.degree)
      if (compare(current, aux[current.degree]) > 0) {
        var temp = current;
        //assign(current, aux[current.degree])
        current = aux[current.degree];
        //assign(aux[current.degree], temp)
        aux[current.degree] = temp;
        console.log(aux[current.degree])// TODO: may or may not need to do something with this
      }
      linkHeaps(aux[current.degree], current, compare);
     //console.log("about to make undefined: " + aux[current.degree].key)
      aux[current.degree] = undefined;
      current.degree++;
      set_degree(current, current.degree);
    }
    //assign(aux[current.degree], current)
    aux[current.degree] = current;
  }

  minNode = undefined;
  for (var i = 0; i < aux.length; i++) {
    if (aux[i]) {
     console.log("looping");
     //console.log(aux[i])
      // Remove siblings before merging
      add_rel(aux[i], "next", aux[i]);
      aux[i].next = aux[i];
      add_rel(aux[i], "prev", aux[i]);
      aux[i].prev = aux[i];
      //console.log("min passed into merge")
      //console.log(minNode)
      minNode = mergeLists(minNode, aux[i], compare);
      //console.log(minNode)
    }
  }
  console.log("about to return from consolidate")
  return minNode;
}

/**
 * Removes a node from a node list.
 *
 * @private
 * @param {Node} node The node to remove.
 */
function removeNodeFromList(node) {
  console.log("removing node from list")
  var prev = node.prev;
  var next = node.next;
  add_rel(prev, "next", next);
  prev.next = next;
  add_rel(next, "prev", prev);
  next.prev = prev;
  add_rel(node, "next", node);
  node.next = node;
  add_rel(node, "prev", node);
  node.prev = node;
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
  console.log("linking heaps")
  removeNodeFromList(max);
  var new_min = mergeLists(max, min.child, compare);
  add_rel(min, "child", new_min);
  min.child = new_min;
  add_rel(max, "parent", min);
  max.parent = min;
  max.isMarked = false;
  unmark_node(max);
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

 //console.log("merging: " + a.key + " " + b.key)

  var temp = a.next;
  add_rel(a, "next", b.next);
  a.next = b.next;
  add_rel(a.next, "prev", a);
  a.next.prev = a;
  add_rel(b, "next", temp);
  b.next = temp;
  add_rel(b.next, "prev", b)
  b.next.prev = b;
  console.log("COMPARING " + a.key + "and" + b.key)
  var lesser = compare(a, b) < 0 ? a : b;
  console.log("LESSER: " + lesser.key)
  return lesser
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
 //console.log("constructing node with key, value: " + key +" "+ value);
  instance.graph.addNode({id : value, label : key, topRightLabel: 0});

  this.key = key;
  this.value = value;
  this.prev = this;
  this.next = this;
  this.degree = 0;

  this.parent = undefined;
  this.child = undefined;
  this.isMarked = undefined;

  add_node(this, undefined, undefined, this, this)
  instance.update();
}
