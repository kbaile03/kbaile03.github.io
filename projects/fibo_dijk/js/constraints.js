var instance;
var count = 1;
var node_rels = [[]];
    node_rels[0] = [undefined, undefined, undefined, undefined, false]
// node_rels[4] = [2, 5, 3, 6, false]
// node_rels[5] = [4, undefined, undefined, undefined, false]
// node_rels[6] = [2, 7, 4, undefined, false]
// node_rels[7] = [6, 9, 8, 0, false]
// node_rels[8] = [6, undefined, undefined, 7, false]
// node_rels[9] = [7, undefined, undefined, undefined, false]

// var nodes = [
//   {id: 0, label : "min"},
//   {id: 1},
//   {id: 2},
//   {id: 3},
//   // {id: 4},
//   // {id: 5},
//   // {id: 6},
//   // {id: 7},
//   // {id: 8},
//   // {id: 9}
// ]
// var links = [
//    {source: 0, target: 1},
//    {source: 1, target: 3},
//    {source: 3, target: 2},
//   // {source: 2, target: 4},
//   // {source: 2, target: 3},
//   // {source: 6, target: 4},
//   // {source: 4, target: 3},
//   // {source: 6, target: 7},
//   // {source: 6, target: 8},
//   // {source: 4, target: 5},
//   // {source: 7, target: 8},
//   // {source: 7, target: 9}
// ]

instance = greuler({
    directed: false,
    target: '#constraints',
    height: 800,
    width: 599,
    animationTime: 800,
    data : {
      nodes: [{id: 0, label: "min"}],
      links: [],
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
}).update();


node1 = new Node(1, 1)
node2 = new Node(2, 2)
node3 = new Node(3, 3)

var edge = { source: 0, target: node1.value };
instance.graph.addEdge(edge);

node_rels[0][1] = node1


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
        levelize(node_rels[nodeId][1].value, offset + 100)
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
    if (instance.options.data.constraints[0]) {
      var obj;
      var nodeInd = getIndex(nodeId)
      for(var i = 0; i < instance.options.data.constraints[0].offsets.length; i++) {
        obj = instance.options.data.constraints[0].offsets[i];
        console.log("CONSTRAINT")
        console.log(offset)
        if (obj.node == nodeInd) {
          if(obj.offset != offset) {
            console.log("OFFSETS DO NOT MATCH: object offset" + obj.offset + "when should be: " + offset)
          }
          console.log("constraint exists")
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
  try {
    if (instance.options.data.constraints[0]) {
      instance.options.data.constraints[0].offsets = [{node: 0, offset: 0}];
    }
    if (instance.options.data.constraints.length > 1) {
      var obj;
      for(var i = 1; i < instance.options.data.constraints.length; i++) {
        instance.options.data.constraints.splice(i, 1)
        i--;
      }
    }
    resetVisited();
    console.log(instance.options.data.constraints)
    instance.update();
  } catch(err) {
    console.log("error deleting all constraints")
  }
}

function resetVisited () {
  for (var i = 0; i < node_rels.length; i++) {
    node_rels[i][4] = false
  }
}

function constrainToLevel(nodeId, offset) {
  console.log("pushing constraint" + nodeId + " " + offset);
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
}





function addDefaultConstraints() {
  constrain_to_level(0, 0)
  constrain_to_level(1, 100)
  constrain_to_level(2, 100)
  constrain_to_level(3, 200)
  constrain_to_level(4, 200)
  constrain_to_level(5, 300)
  constrain_to_level(6, 200)
  constrain_to_level(7, 300)
  constrain_to_level(8, 300)
  constrain_to_level(9, 400)
  instance.update();
}

//
//   console.log(instance.layout.distanceMatrix())
//
//   levelize(0, 0);
//
//   console.log(instance.options.data.constraints);
// // addDefaultConstraints();
//
resetAllCons();
//
instance.update();
//
console.log(instance.options.data.constraints)


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
