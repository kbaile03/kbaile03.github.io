var heap = new FibonacciHeap();
var count = 1;

console.log(heap);

function insert() {
  var x = parseInt(document.getElementById("fib_insert_key").value);
  if (x != NaN) {
    resetAllCons()
    console.log("count" + count);
    heap.insert(x, count);
    count += 1;
    levelize(0, 0)
  }

}

function fib_clear() {
  //resetAllCons();
  console.log("clearing")
  heap.clear();
  var parent = document.getElementById("fibonacci_ex_parent");
  var child =  document.getElementById("fibonacci_ex");
  parent.removeChild(child);
  var new_child = document.createElement("div");
  new_child.classList.add("heap");
  new_child.id = "fibonacci_ex";
  parent.appendChild(new_child);
  count = 1;
  heap = new FibonacciHeap();
}

function delete_min() {
  resetAllCons()
  console.log("deleting");
  delete_node(heap.extractMinimum());
  levelize(0, 0)
}
