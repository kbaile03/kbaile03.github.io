var heap = new FibonacciHeap()
var count = 1

function insert () {
  var x = parseInt(document.getElementById('fib_insert_key').value)
  try {
    if (!isNaN(x)) {
      resetAllCons()
      heap.insert(x, count)
      count++
      levelize(0, 0)
    }
  } catch (err) {
    console.log('node index' + count + ' is already taken, incrementing')

  }
}

function fibClear () {
  heap.clear()
  var parent = document.getElementById('fibonacci_ex_parent')
  var child = document.getElementById('fibonacci_ex')
  parent.removeChild(child)
  var newChild = document.createElement('div')
  newChild.classList.add('heap')
  newChild.id = 'fibonacci_ex'
  parent.appendChild(newChild)
  count = 1
  heap = new FibonacciHeap()
}

function deleteMin () {
  deleteNode(heap.extractMinimum())
  resetAllCons()
  levelize(0, 0)
}

function deleteKey () {
  var x = parseInt(document.getElementById('fib_delete_key').value)
    if (!isNaN(x)) {
      resetAllCons()
      deleteNode(heap.deleteTranslate(x))
      levelize(0, 0)
    }
}
