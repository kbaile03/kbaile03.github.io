
/**
 * Creates a dijkstra graph
 *
 * @constructor
 * @param {string} div the div name
 * @param {int} height the height of the svg
 * @param {int} width the width of the svg
 *
 */
function Dijkstra (div, height, width) {
  this.instance = greuler({
    directed: true,
    target: '#' + div,
    height: height,
    width: width,
    animationTime: 800
  }).update()
  this.start = undefined
  this.successors = undefined
  this.div = div
  this.done = false
}

/**
 *
 *
 * @param {string} the div name
 * @param {int} height the height of the svg
 * @param {int} width the width of the svg
 * @param {bool} whether half class or not
 *
 */
Dijkstra.prototype.dijkstraReset = function (div, height, width, half) {
  var parent = document.getElementById(div + '_parent')
  var child = document.getElementById(div)
  var solu = document.getElementById(div + '_solution')
  parent.removeChild(child)
  parent.removeChild(solu)
  var new_child = document.createElement('div')
  var new_solu = document.createElement('div')
  new_child.id = div
  new_child.classList.add('graph')
  if (half) {
    new_child.classList.add('half')
  }
  new_solu.id = div + '_solution'
  parent.appendChild(new_child)
  parent.appendChild(new_solu)

  // todo
  this.done = false
  this.instance = greuler({
    directed: true,
    target: '#' + div,
    height: height,
    width: width,
    animationTime: 800,
    data: greuler.Graph.random({order: 14, size: 21, connected: true})
  }).update()
  this.instance.options.data.links.forEach(function (e) {
    e.weight = Math.floor((Math.random() * 10) + 1)
  })
  this.instance.options.data.nodes.forEach(function (n) {
    n.fill = 'black'
    n.label = '∞'
    n.topRightLabel = 0
  })
  this.instance.options.data.nodes[0].fill = 'blue'
  this.instance.options.data.nodes[13].fill = 'red'
  this.instance.options.data.nodes[13].label = 0
  this.instance.update()
  // console.log(this.instance)
  this.start = this.instance.graph.getNode({id: 13})
  this.successors = [this.start]

}

/**
 *
 *
 */
Dijkstra.prototype.dijkstraStep = function () {
  if (!this.done) {
    this.successors.sort(nodecompareOp)
    var here = this.successors.pop()
    if (here !== undefined) {
      //
      // console.log('here')
      // console.log(here.label)
      if (here.topRightLabel !== 1) {

        var temp = this.instance.graph.getSuccessorNodes({id: here.id})

        temp.sort(nodecompare)
        if (temp.length !== 0) {
          for (var i = 0; i < temp.length; i++) {
            // console.log('tempid')
            // console.log(temp[i].label)
            if (temp[i].topRightLabel !== 1) {
              this.successors.push(temp[i])
              var edges = this.instance.graph.getEdgesBetween({source: here.id, target: temp[i].id})
              if (temp[i].label === '∞') {
                temp[i].label = edges[0].weight + here.label
                // console.log('label')
                // console.log(temp[i].label)
              } else if (temp[i].label > edges[0].weight + here.label) {
                var oldLabel = temp[i].label
                temp[i].label = edges[0].weight + here.label
                // console.log('label2')
                // console.log(temp[i].label)
              } else {
                // console.log("ELSE WHAT")
              }

            } else {
              // console.log('ELSE WHAT 2')

            }
          }
          var update = this.instance.graph.getNode({ id: here.id })
          //update.fill = 'white' // TODO: get this to actually chnage color
          // console.log('marking ' + here.label)
          update.topRightLabel = 1
          this.instance.selector.highlightNode({id: here.id})
          this.instance.selector.getEdges()
            .attr('stroke', function (d) { return d.stroke })
          this.instance.selector.traverseOutgoingEdges({id: here.id})

          if (here.fill === 'blue') {
            // console.log('hello')
            this.done = true
          }
          this.instance.update()
        } else {
          // console.log('else what 2.5')
          this.dijkstraStep()
        }
      } else {
        // console.log('ELSE WHAT 3')
        this.dijkstraStep()
      }
    } else {
      this.done = true
    }
  } else {
    document.getElementById(this.div + '_solution').innerHTML = 'The best distance is: ' + this.instance.options.data.nodes[0].label
  }
}


function nodecompareOp(a, b) {
  if (a.label < b.label) {
    //console.log(a.label + '<' + b.label)
    return 1
  } else {
    //console.log(b.label + '<' + a.label)
    return -1
  }
}

//
// /**
//  *
//  *
//  */
// Dijkstra.prototype.dijkstraStep = function () {
//   var here = this.successors.pop()
//   if (here !== undefined) {
//     console.log('here')
//     console.log(here.label)
//     if (here.topRightLabel !== 1) {
//       var temp = this.instance.graph.getSuccessorNodes({id: here.id})
//       for (var i = 0; i < temp.length; i++) {
//         console.log('tempid')
//         console.log(temp[i].label)
//         if (temp[i].topRightLabel !== 1) {
//           this.successors.push(temp[i])
//           var edges = this.instance.graph.getEdgesBetween({source: here.id, target: temp[i].id})
//           if (temp[i].label === '∞') {
//             temp[i].label = edges[0].weight + here.label
//             console.log('label')
//             console.log(temp[i].label)
//           } else if (temp[i].label > edges[0].weight + here.label) {
//             temp[i].label = edges[0].weight + here.label
//             console.log('label2')
//             console.log(temp[i].label)
//           }
//           this.instance.selector.getEdges()
//             .attr('stroke', function (d) { return d.stroke })
//           this.instance.selector.highlightNode({id: here.id})
//           this.instance.selector.traverseOutgoingEdges({id: here.id})
//           console.log(here)
//           console.log(this.instance.options.data.nodes)
//           var update = this.instance.graph.getNode({ id: here.id });
//           update.fill = 'white'
//           update.topRightLabel = 1
//           this.instance.update()
//         }
//       }
//     }
//   } else {
//     document.getElementById(this.div +'_solution').innerHTML = 'The best distance is: ' + this.instance.options.data.nodes[0].label
//   }
// }
