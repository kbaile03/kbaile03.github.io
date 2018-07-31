var nodes_f = [
  {id: 0},
  {id: 1},
  {id: 2},
  {id: 3},
  {id: 4}
]
var links_f = [
  {source: 0, target: 1},
  {source: 1, target: 2},
  {source: 2, target: 0},
  {source: 3, target: 4}
]

var nodes_d = [
  {id: 0},
  {id: 1},
  {id: 2},
  {id: 3},
  {id: 4}
]
var links_d = [
  {source: 0, target: 1, weight: "10"},
  {source: 1, target: 2, weight: "11"},
  {source: 2, target: 0, weight: "15"},
  {source: 3, target: 4, weight: "20"}
]

var fibo = greuler({
  target: '#fibonacci',
  width: 600,
  data: {
    nodes : nodes_f,
    links : links_f
  }
})
fibo.update()

var dijk = greuler({
  target: '#dijkstra',
  width: 600,
  data: {
    nodes : nodes_d,
    links : links_d
  }
})
dijk.update()
