var instance;
var q;
var start;
var successors;
instance = greuler({
    directed: true,
    target: '#dijkstra_ex',
    height: 500,
    width: 600,
    animationTime: 800
}).update();

function dijkstra_ex_reset() {
  var parent = document.getElementById("dijkstra_ex_parent");
  var child =  document.getElementById("dijkstra_ex");
  parent.removeChild(child);
  var new_child = document.createElement("div");

  new_child.id = "dijkstra_ex";
  new_child.classList.add("graph");
  parent.appendChild(new_child);

  instance = greuler({
      directed: true,
      target: '#dijkstra_ex',
      height: 500,
      width: 600,
      animationTime: 800,
      data: greuler.Graph.random({order : 10, size : 15, connected: true })
  }).update();
    instance.options.data.links.forEach(function (e) {
      e.weight = Math.floor((Math.random() * 10) + 1);
    })
    instance.options.data.nodes.forEach(function (n) {
      n.fill = "#654c4f";
      n.label="∞";
      n.topRightLabel = 0;
    })
    instance.options.data.nodes[0].fill = "black";
    instance.options.data.nodes[9].fill = "red";
    instance.options.data.nodes[9].label = 0;
    console.log(instance);
    q = new Queue();
    instance.options.data.nodes.forEach(function (n) {
      q.enqueue(n);
    })
    start = instance.graph.getNode({id: 9});
    successors = [start]
};

// var curr_node = 14;
// var successors = [];
//
// function dijkstra_ex_step() {
//
//   if (successors.length == 0) {
//     instance.selector.getEdges()
//       .attr('stroke', function (d) { return d.stroke; });
//       instance.selector.highlightNode({id : curr_node});
//       instance.selector.traverseOutgoingEdges({id : curr_node});
//   successors = instance.graph.getSuccessorNodes({id : curr_node});
//   console.log(successors);
//   for (var i = 0; i < successors.length; i++) {
//     var edge = instance.graph.getEdgesBetween({source: curr_node, target : successors[i].id})
//     console.log(edge);
//     successors[i].label = edge[i].weight + instance.graph.getNode({id : 14}).label;
//   }
// } else {
//
// }}



function dijkstra_ex_step() {
    var here = successors.pop()
    if (here != undefined) {
      console.log('here')
      if (here.topRightLabel != 1) {
        var temp = instance.graph.getSuccessorNodes({id: here.id})
        for (var i = 0; i < temp.length; i++) {
            console.log('tempid')
            console.log(temp[i].label);
            if (temp[i].topRightLabel != 1) {
              successors.push(temp[i])
            }
            var edges = instance.graph.getEdgesBetween({source: here.id, target: temp[i].id})
            if (temp[i].label == "∞") {

              temp[i].label = edges[0].weight + here.label
              console.log('label')
              console.log(temp[i].label)
            } else if (temp[i].label > edges[0].weight + here.label) {
              temp[i].label = edges[0].weight + here.label
              console.log('label2')
              console.log(temp[i].label)
            }
            instance.selector.getEdges()
                   .attr('stroke', function (d) { return d.stroke; });
                   instance.selector.highlightNode({id : here.id});
                   instance.selector.traverseOutgoingEdges({id : here.id});
            here.topRightLabel = 1;
            instance.update();
        }
      }
    } else {
      document.getElementById("dijk_solution").innerHTML = "The best distance is: " + instance.options.data.nodes[0].label
    }
}

/*

Queue.js

A function to represent a queue

Created by Kate Morley - http://code.iamkate.com/ - and released under the terms
of the CC0 1.0 Universal legal code:

http://creativecommons.org/publicdomain/zero/1.0/legalcode

*/

/* Creates a new queue. A queue is a first-in-first-out (FIFO) data structure -
 * items are added to the end of the queue and removed from the front.
 */
function Queue(){

  // initialise the queue and offset
  var queue  = [];
  var offset = 0;

  // Returns the length of the queue.
  this.getLength = function(){
    return (queue.length - offset);
  }

  // Returns true if the queue is empty, and false otherwise.
  this.isEmpty = function(){
    return (queue.length == 0);
  }

  /* Enqueues the specified item. The parameter is:
   *
   * item - the item to enqueue
   */
  this.enqueue = function(item){
    queue.push(item);
  }

  /* Dequeues an item and returns it. If the queue is empty, the value
   * 'undefined' is returned.
   */
  this.dequeue = function(){

    // if the queue is empty, return immediately
    if (queue.length == 0) return undefined;

    // store the item at the front of the queue
    var item = queue[offset];

    // increment the offset and remove the free space if necessary
    if (++ offset * 2 >= queue.length){
      queue  = queue.slice(offset);
      offset = 0;
    }

    // return the dequeued item
    return item;

  }

  /* Returns the item at the front of the queue (without dequeuing it). If the
   * queue is empty then undefined is returned.
   */
  this.peek = function(){
    return (queue.length > 0 ? queue[offset] : undefined);
  }

}
