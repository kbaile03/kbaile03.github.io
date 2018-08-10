greuler({
  directed: false,
  target: '#fibonacci_ex',
  width: 800,
  height: 500
}).update()

var count = 1
var heap

function insert () {
  var x = parseInt(document.getElementById('fib_insert_key').value)
  try {
    if (!isNaN(x)) {
      layoutStop()
      resetAllCons()
      heap.insert(x, count, '#9da9a0')
      count++
      levelize(0, 0)
      layoutStart()
    }
  } catch (err) {
    console.log('node index' + count + ' is already taken, incrementing')

  }
}

function fibClear () {
  if (heap) {
    heap.clear()
  }
  var parent = document.getElementById('fibonacci_ex_parent')
  var child = document.getElementById('fibonacci_ex')
  parent.removeChild(child)
  var newChild = document.createElement('div')
  newChild.classList.add('heap')
  newChild.id = 'fibonacci_ex'
  parent.appendChild(newChild)
  count = 1
  heap = new FibonacciHeap('fibonacci_ex', 500, 800)
}



function deleteMin () {
  layoutStop()
  resetAllCons()
  console.log("extract")
  deleteNode(heap.extractMinimum())
  console.log("levelize")
  levelize(0, 0)
  console.log("and start")
  layoutStart()
}

function deleteKey () {
  var x = parseInt(document.getElementById('fib_delete_key').value)
  if (!isNaN(x)) {
    layoutStop()
    resetAllCons()
    try {
      deleteNode(heap.deleteTranslate(x))
    } catch (err) {
      console.log('key does not exist')
    }
    levelize(0, 0)
    layoutStart()
  }
}
