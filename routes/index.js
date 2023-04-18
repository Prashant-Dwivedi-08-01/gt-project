var express = require('express');
var Graph = require('graphology');

var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('graph');
});


// router.post('/', function(req, res, next) {
//   res.render('graph');
// });


router.post('/solve', function(req, res, next) {
  /*
    res.body = {
      no_of_nodes: 5,
      nodes: ["A", "B", "C", "D", "E"],
      "A": ["B", "C"],
      "B": ["A", "C", "D"],
      "C": ["A", "B", "D", "E"],
      "D": ["B", "C", "E"],
      "E": ["C", "D"]
    }
  */
  const no_of_nodes = req.body.no_of_nodes;
  const node = req.body.nodes;
  const no_of_people_telling_truth = req.body.no_of_people_telling_truth;

  const graph = new Graph(type="directed");

  // add nodes
  for (var i = 0; i < no_of_nodes; i++) {
    graph.addNode(node[i]);
  }

  // add edges
  for (var i = 0; i < no_of_nodes; i++) {
    for (var j = 0; j < req.body[node[i]].length; j++) {
      graph.addEdge(node[i], req.body[node[i]][j]);
    }
  }

  //Graph Visualization
  // let g = {}
  // graph.forEachNode((node, attr) => {
  //   g[node] = graph.everyOutNeighbors(node);
  // });
  // console.log(g);

  // find the nodes with no of edges equal to no_of_people_telling_truth
  let edges_entering_each_nodes = {};
  graph.forEachNode((node, attr) => {
    edges_entering_each_nodes[node] = graph.inNeighbors(node);
  });


  let list_of_suspects = [];
  for (var i = 0; i < no_of_nodes; i++) {
    if (edges_entering_each_nodes[node[i]].length == no_of_people_telling_truth) {
      list_of_suspects.push(node[i]);
    }
  }
  
  return res.json({
    // "graph": g,
    "edges_entering_each_nodes": edges_entering_each_nodes,
    "list_of_suspects": list_of_suspects
  });
});


module.exports = router;
