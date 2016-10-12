function createErdosRenyi(n, p) {
  const graph = { nodes: [], edges: [] };
  for (let i = 0; i < n; i++) {
    graph.nodes.push(i);
    for (let j = 0; j < i; j++) {
      if (Math.random() < p) {
        graph.edges.push({
          source: i,
          target: j
        });
      }
    }
  }
  return graph;
}

function drawNetwork(context, nodes, graph) {
  graph.edges.forEach((edge) => {
    context.beginPath();
    context.moveTo(...nodes[edge.source]);
    context.lineTo(...nodes[edge.target]);
    context.stroke();
  });

  nodes.forEach(([x, y]) => {
    context.beginPath();
    context.arc(x, y, 8 + Math.floor((Math.random() * 12)), 0, 2 * Math.PI);
    context.fill();
  });
}

export default function drawFancyNodes(context, { width, height }) {
  context.clearRect(0, 0, width, height);
  context.fillStyle = 'rgba(0, 0, 0, 0.3)';
  context.strokeStyle = context.fillStyle;
  context.globalCompositeOperation = 'overlay';
  context.lineWidth = 1;
  context.globalAlpha = 0.1;

  const graph = createErdosRenyi(20, 0.3);

  const leftNodes = graph.nodes.map(() =>
    [(width * Math.random()) / 3, Math.random() * height]
  );

  const rightNodes = graph.nodes.map(() =>
    [(width - (width * Math.random())) / 3, Math.random() * height]
  );

  drawNetwork(context, leftNodes, graph);
  drawNetwork(context, rightNodes, graph);
}
