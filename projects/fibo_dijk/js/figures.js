var dijkstra = new Dijkstra('dijkstra', 600, 397)
var done = false

greuler({
  directed: false,
  target: '#fibonacci',
  width: 397,
  height: 600
}).update()

var count = 1
var heap

function figuresReset () {
  dijkstra.dijkstraReset('dijkstra', 600, 397, true)
  fibbClear()
  done = false
  dijkstra.instance.options.data.nodes.forEach( function (n) {
    if (n.label === '∞') {
      fibInsert('∞', n.id, '#9da9a0')
    } else {
      fibInsert(n.label, n.id, '#9da9a0')
    }
  })
}



function figuresStep () {
  if (!done) {
    dijkstra.successors.sort(nodecompareOp)
    var here = dijkstra.successors.pop()
    if (here !== undefined) {

      // console.log('here')
      // console.log(here.label)
      if (here.topRightLabel !== 1) {

        var temp = dijkstra.instance.graph.getSuccessorNodes({id: here.id})

        temp.sort(nodecompare)
        if (temp.length !== 0) {
          for (var i = 0; i < temp.length; i++) {
            // console.log('tempid')
            // console.log(temp[i].label)
            if (temp[i].topRightLabel !== 1) {
              dijkstra.successors.push(temp[i])
              var edges = dijkstra.instance.graph.getEdgesBetween({source: here.id, target: temp[i].id})
              if (temp[i].label === '∞') {
                temp[i].label = edges[0].weight + here.label
                // console.log('label')
                // console.log(temp[i].label)
                fibDecreaseKey('∞', temp[i].label)
              } else if (temp[i].label > edges[0].weight + here.label) {
                var oldLabel = temp[i].label
                temp[i].label = edges[0].weight + here.label
                // console.log('label2')
                // console.log(temp[i].label)
                fibDecreaseKey(oldLabel, temp[i].label)
              } else {
                console.log("ELSE WHAT")
              }

             }
             // else {
            //   console.log('ELSE WHAT 2')
            //
            // }
          }
          var update = dijkstra.instance.graph.getNode({ id: here.id })
          //update.fill = 'white' // TODO: get this to actually chnage color
          // console.log('marking ' + here.label)
          update.topRightLabel = 1
          dijkstra.instance.selector.highlightNode({id: here.id})
          dijkstra.instance.selector.getEdges()
            .attr('stroke', function (d) { return d.stroke })
          dijkstra.instance.selector.traverseOutgoingEdges({id: here.id})

          if (here.fill === 'blue') {
            // console.log('hello')
            done = true
          } else {
            // console.log('extraction')
            var min = heap.minNode
            if (min.key === dijkstra.instance.options.data.nodes[0].label) {
              done = true
            } else {
              resetAllCons()
              deleteNode(heap.extractMinimum())
              levelize(0,0)
            }



          }
          dijkstra.instance.update()
        } else {
          figuresStep()
        }
      } else {
        figuresStep()
      }
    } else {
      done = true
    }
  } else {
    document.getElementById(dijkstra.div + '_solution').innerHTML = 'The best distance is: ' + dijkstra.instance.options.data.nodes[0].label
  }
}

function nodecompare(a, b) {
  if (a.label < b.label) {
    return -1
  } else {
    return 1
  }
}

function nodecompareOp(a, b) {
  if (a.label < b.label) {
    return 1
  } else {
    return -1
  }
}

function fibInsert (val, id, color) {
  resetAllCons()
  heap.insert(val, id+1, color)
  count++
  levelize(0, 0)
}

function fibDecreaseKey (oldkey, newkey) {
  resetAllCons()
  heap.decreaseKeyTranslate(oldkey, newkey)
  levelize(0, 0)
}

function fibDeleteMin () {
  deleteNode(heap.extractMinimum())
  resetAllCons()
  levelize(0, 0)
}

function fibDeleteKey () {
  var x = parseInt(document.getElementById('fib_delete_key').value)
  if (!isNaN(x)) {
    resetAllCons()
    deleteNode(heap.deleteTranslate(x))
    levelize(0, 0)
  }
}

function fibbClear () {
  if (heap) {
    heap.clear()
  }
  var parent = document.getElementById('fibonacci_parent')
  var child = document.getElementById('fibonacci')
  parent.removeChild(child)
  var newChild = document.createElement('div')
  newChild.classList.add('heap')
  newChild.classList.add('half')
  newChild.id = 'fibonacci'
  parent.appendChild(newChild)
  count = 1
  heap = new FibonacciHeap('fibonacci', 600, 397, compInfinity)
}

function compInfinity (a, b) {
  if (a.key === '∞') {
    return 1
  }
  if (b.key ==='∞') {
    return -1
  }
  if (a.key > b.key) {
    return 1
  } else if (a.key < b.key) {
    return -1
  }
  return 0;
}
