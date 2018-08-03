var instance;
dijkstra_ex_reset();

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
      data: greuler.Graph.random({order : 15, size : 25, connected: true })
  }).update();
    instance.options.data.links.forEach(function (e) {
      e.weight = Math.floor((Math.random() * 10) + 1);
    })
    instance.options.data.nodes.forEach(function (n) {
      n.fill = "#654c4f";
      n.label="∞";
    })
    instance.options.data.nodes[0].fill = "black";
    instance.options.data.nodes[14].fill = "red";
    instance.options.data.nodes[14].label = "0";
    console.log(instance);
};

var start_node = 14;

function dijkstra_ex_step() {
  // get all the edges and reset their stroke style
  // with the `stroke` property stored in the edge datum
  instance.selector.getEdges()
    .attr('stroke', function (d) { return d.stroke; });

  instance.selector.highlightNode({ id: start_node });

  // traverse an edge with a custom animation, when an edge is
  // traversed it's automatically marked as red for you
  instance.selector.traverseOutgoingEdges({ id: start_node });

  // edge traversal methods
  // - selector.traverseIncomingEdges
  // - selector.traverseOutgoingEdges
  // - selector.traverseIncidentEdges

}
