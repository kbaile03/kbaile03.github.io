var heap = new FibonacciHeap();
var count = 0;

console.log(heap);

function insert() {
  var x = document.getElementById("fib_insert_key").value;
  if (x != "") {
    heap.insert(x, count);
    count += 1;
  }
}

function fib_clear() {
  console.log("clearing")
  heap.clear();
  var parent = document.getElementById("fibonacci_ex_parent");
  var child =  document.getElementById("fibonacci_ex");
  parent.removeChild(child);
  var new_child = document.createElement("div");
  new_child.classList.add("heap");
  new_child.id = "fibonacci_ex";
  parent.appendChild(new_child);
  count = 0;
  heap = new FibonacciHeap();
}

function delete_min() {
  console.log("deleting");
  console.log(heap.extractMinimum());
}
