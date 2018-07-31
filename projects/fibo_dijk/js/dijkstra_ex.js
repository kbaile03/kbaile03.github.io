dijkstra_ex_reset();

function dijkstra_ex_reset() {
  instance = greuler({
      directed: true,
      target: '#dijkstra_ex',
      height: 500,
      animationTime: 800,
      data: greuler.Graph.random({order : 15, size : 25, connected: true })
  }).update();
    instance.options.data.links.forEach(function (e) {
      e.weight = Math.floor((Math.random() * 10) + 1);
    })
    instance.options.data.nodes.forEach(function (n) {
      n.label="∞"
    })
    instance.options.data.nodes[0].fill = "black";
    instance.options.data.nodes[14].fill = "red";
    instance.options.data.nodes[14].label = "0";
};

var start_node = 14;

function dijkstra_ex_step() {
var id = start_node;

// get all the edges and reset their stroke style
// with the `stroke` property stored in the edge datum
instance.selector.getEdges()
  .attr('stroke', function (d) { return d.stroke; });

instance.selector.highlightNode({ id: id });

// traverse an edge with a custom animation, when an edge is
// traversed it's automatically marked as red for you
console.log(instance.selector.traverseOutgoingEdges({ id: id }));

// edge traversal methods
// - selector.traverseIncomingEdges
// - selector.traverseOutgoingEdges
// - selector.traverseIncidentEdges

}
