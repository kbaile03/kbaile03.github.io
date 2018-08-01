var heap = new FibonacciHeap();

var nodes = [];
var links = [];

console.log(heap);

function insert() {
  var x = document.getElementById("fib_insert_key").value;
  if (x != "") {
    heap.insert(x, 1000);
  }
}

function clear() {
  heap.clear();
  
}
