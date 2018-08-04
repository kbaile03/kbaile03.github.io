// implement animations for fibonacci heap in cola.js;
var count = 1;
var instance;

// var nodes = [{id:"min"},
//              {id:0},
//              {id:1},
//              {id:2},
//              {id:3},
//              {id:4}]; // makes min pointer possible
// var links = [{"source":1,"target":2},
//       {"source":2,"target":0},
//       {"source":2,"target":3},
//       {"source":2,"target":4}];

var nodes = [{id:"min"}];
var links = [];

instance = greuler({
  directed: false,
  target: "#fibonacci_ex",
  width: 600,
  data: {
    flowLayout: ['y', 30],
    nodes: nodes,
    links: links,
    constraints: []
    groups: []
  }
}).update();// the greuler instance


// helper functions I wrote to interface with Greuler / Cola more easily


// data structure for keeping track of parents / children
var node_rels = [[]];

function add_node(this_node, parent_node, child_node, next_node, prev_node) {
  node_rels.push([]);
  node_rels[this_node][0] = parent_node;
  node_rels[this_node][1] = child_node;
  node_rels[this_node][2] = next_node;
  node_rels[this_node][3] = prev_node;
}

function delete_node(node) {
  console.log("deleting node: " + node.key)
  node_rels[node.value][0] = undefined;
  node_rels[node.value][1] = undefined;
  node_rels[node.value][2] = undefined;
  node_rels[node.value][3] = undefined;
  instance.graph.removeNode({ id: node.value });
  instance.update();
}

function set_degree(node, new_degree) {
  var update = instance.graph.getNode({ id: node.value });
  update.topRightLabel = new_degree;
  instance.update();
}

function add_rel(node1_id, rel, node2_id) {
  if (node1_id && node2_id) {
    if (rel == "parent") {
      if (node_rels[node1_id][0] != undefined) { // if parent exists
        remove_links_between(node1_id, node_rels[node1_id][0]) // remove it
      }
      node_rels[node1_id][0] = node2_id;
    }
    else if (rel == "child") {
      if (node_rels[node1_id][1] != undefined) {
        remove_links_between(node1_id, node_rels[node1_id][1])
      }
      node_rels[node1_id][1] = node2_id;
    }
    else if (rel == "next") {
      if (node_rels[node1_id][2] != undefined) {
        remove_links_between(node1_id, node_rels[node1_id][2])
      }
      node_rels[node1_id][2] = node2_id;
    }
    else if (rel == "prev") {
      if (node_rels[node1_id][3] != undefined) {
        remove_links_between(node1_id, node_rels[node1_id][3])
      }
      node_rels[node1_id][3] = node2_id;
    }
    var edges = instance.graph.getAllEdgesBetween({source: node1_id, target: node2_id});
    if (edges.length == 0) {
      edge = {source: node1_id, target: node2_id, directed: false};
      instance.graph.addEdge(edge);
    }
  }
}

function rem_rel(node1_id, rel) {
  if (node1_id && node2_id) {
    var node2_id;
    if (rel == "parent") {
      node2_id = node_rels[node1_id][0];
      node_rels[node1_id][0] = undefined;
    }
    else if (rel == "child") {
      node2_id = node_rels[node1_id][1];
      node_rels[node1_id][1] = undefined;
    }
    else if (rel == "next") {
      node2_id = node_rels[node1_id][2];
      node_rels[node1_id][2] = undefined;
    }
    else if (rel == "prev") {
      node2_id = node_rels[node1_id][3];
      node_rels[node1_id][3] = undefined;
    }
    remove_links_between(node1_id, node2_id);
  }
}

function remove_links_between(node1_id, node2_id) {
  var edges = instance.graph.getAllEdgesBetween({source: node1_id, target: node2_id});
  instance.graph.removeEdges(edges);
  instance.update();
}
//
// function double_link(node1_id, node2_id) {
//   console.log("double linking")
//   var edge1 = { source: node1_id, target: node2_id, directed: false };
//   var edge2 = { source: node2_id, target: node1_id, directed: false };
//   instance.graph.addEdge(edge1);
//   instance.graoh.addEdge(edge2);
//   instance.update();
// }

function point_min(node1_id) {
  console.log("pointing min to: " + node1_id);
  var mins = instance.graph.getOutgoingEdges({id : "min"});
  console.log(mins);
  instance.graph.removeEdges(mins)
  if (node1_id) {
    var edge = { source: "min", target: node1_id, directed: true };
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






function clear_heap() {
  console.log("clearing")
  heap.clear();
  var parent = document.getElementById("fibonacci_ex_parent");
  var child =  document.getElementById("fibonacci_ex");
  parent.removeChild(child);
  var new_child = document.createElement("div");
  new_child.classList.add("heap");
  new_child.id = "fibonacci_ex";
  parent.appendChild(new_child);
  count = 0;
  heap = new FibonacciHeap();
}

function insert() {
  var x = document.getElementById("fib_insert_key").value;
  if (x != "") {
    instance.graph.addNode({ id: count , label : x});
    console.log(node_rels);

    if( node_rels.length == 1) {
      point_min(count)
      console.log("WHAT")
      console.log(instance.options.data.constraints.push({axis: "x", left: 0, right: 1, gap: 0}));
      console.log(instance.options.data.constraints.push({axis: "x", left: 1, right: 0, gap: 0}));
      add_node(count, 0, undefined, undefined, undefined)
      console.log("link length");
      console.log(instance.options);
    }
    else {
      console.log("hello")
      add_node(count, undefined, undefined, undefined, undefined)
      add_rel(count, "next", 1);
      console.log(instance.options.data.constraints.push({axis: "y", left: 2, right: 1, gap: 0}));
      console.log(instance.options.data.constraints.push({axis: "y", left: 1, right: 2, gap: 0}));

    }

    instance.update();


    count += 1;
  }
}

function constrain_horz(node1, node2) {
  console.log(instance.options.data.constraints.push({axis: "x", left: node1.value, right: node2.value, gap: 0}));
  console.log(instance.options.data.constraints.push({axis: "x", left: node2.value, right: node1.value, gap: 0}));
}

function constrain_vert(node1, node2) {
  console.log(instance.options.data.constraints.push({axis: "y", left: node1.value, right: node2.value, gap: 0}));
  console.log(instance.options.data.constraints.push({axis: "y", left: node2.value, right: node1.value, gap: 0}));
}


function delete_min() {
  console.log("deleting");
  heap.extractMinimum();
}
