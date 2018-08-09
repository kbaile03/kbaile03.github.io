var instance
var start
var successors

instance = greuler({
  directed: true,
  target: '#dijkstra_ex',
  height: 500,
  width: 800,
  animationTime: 800
}).update()

function dijkstraReset () {
  var parent = document.getElementById('dijkstra_ex_parent')
  var child = document.getElementById('dijkstra_ex')
  var solu = document.getElementById('dijk_solution')
  parent.removeChild(child)
  parent.removeChild(solu)
  var new_child = document.createElement('div')
  var new_solu = document.createElement('div')
  new_child.id = 'dijkstra_ex'
  new_child.classList.add('graph')
  new_solu.id = 'dijk_solution'
  parent.appendChild(new_child)
  parent.appendChild(new_solu)

  instance = greuler({
    directed: true,
    target: '#dijkstra_ex',
    height: 500,
    width: 800,
    animationTime: 800,
    data: greuler.Graph.random({order: 14, size: 21, connected: true})
  }).update()
  instance.options.data.links.forEach(function (e) {
    e.weight = Math.floor((Math.random() * 10) + 1)
  })
  instance.options.data.nodes.forEach(function (n) {
    n.fill = 'black'
    n.label = '∞'
    n.topRightLabel = 0
  })
  instance.options.data.nodes[0].fill = 'blue'
  instance.options.data.nodes[13].fill = 'red'
  instance.options.data.nodes[13].label = 0
  instance.update()
  console.log(instance)
  start = instance.graph.getNode({id: 13})
  successors = [start]

}

function dijkstraStep () {
  var here = successors.pop()
  if (here !== undefined) {
    console.log('here')
    console.log(here.label)
    if (here.topRightLabel !== 1) {
      var temp = instance.graph.getSuccessorNodes({id: here.id})
      for (var i = 0; i < temp.length; i++) {
        console.log('tempid')
        console.log(temp[i].label)
        if (temp[i].topRightLabel !== 1) {
          successors.push(temp[i])
          var edges = instance.graph.getEdgesBetween({source: here.id, target: temp[i].id})
          if (temp[i].label === '∞') {
            temp[i].label = edges[0].weight + here.label
            console.log('label')
            console.log(temp[i].label)
          } else if (temp[i].label > edges[0].weight + here.label) {
            temp[i].label = edges[0].weight + here.label
            console.log('label2')
            console.log(temp[i].label)
          }
          instance.selector.getEdges()
            .attr('stroke', function (d) { return d.stroke })
          instance.selector.highlightNode({id: here.id})
          instance.selector.traverseOutgoingEdges({id: here.id})
          console.log(here)
          console.log(instance.options.data.nodes)
          var update = instance.graph.getNode({ id: here.id })
          update.fill = 'white' // TODO: get this to actually chnage color
          update.topRightLabel = 1
          instance.update()
        }
      }
    }
  } else {
    document.getElementById('dijk_solution').innerHTML = 'The best distance is: ' + instance.options.data.nodes[0].label
  }
}
