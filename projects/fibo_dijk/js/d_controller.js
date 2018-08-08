var dijkstraEx = new Dijkstra('dijkstra_ex', 500, 800)

function dReset(div, height, width, half) {
  dijkstraEx.dijkstraReset(div, height, width, half)
}

function dStep () {
  dijkstraEx.dijkstraStep();
}
