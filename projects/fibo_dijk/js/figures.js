var dijkstra = new Dijkstra('dijkstra', 600, 397)


greuler({
  directed: false,
  target: '#fibonacci',
  width: 397,
  height: 600
}).update()

var count = 1
var heap

function figuresReset() {
  dijkstra.dijkstraReset('dijkstra', 600, 397, true)
  fibbClear()

  dijkstra.instance.options.data.nodes.forEach( function (n) {
    if (n.label === '∞') {
      fibInsert(10000)
    } else {
      fibInsert(n.label)
    }

  })

}


function fibInsert (val) {
  resetAllCons()
  heap.insert(val, count)
  count++
  levelize(0, 0)
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
  heap = new FibonacciHeap('fibonacci', 600, 397)
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
