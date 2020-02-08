function createErdosRenyi(n, p) {
  const graph = { nodes: [], edges: [] };
  for (let i = 0; i < n; i++) {
    graph.nodes.push({
      node: i,
      edgeCount: 0
    });
    for (let j = 0; j < i; j++) {
      if (Math.random() < p) {
        graph.nodes[i].edgeCount++;
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
  graph.edges.forEach(edge => {
    context.beginPath();
    context.moveTo(...nodes[edge.source]);
    context.lineTo(...nodes[edge.target]);
    context.stroke();
  });

  nodes.forEach(([x, y], node) => {
    const edgeCount = graph.nodes[node].edgeCount;
    context.beginPath();
    context.arc(x, y, 4 + Math.floor(edgeCount * 4), 0, 2 * Math.PI);
    context.fill();
  });
}

export default function drawFancyNodes(context, { width, height }) {
  context.clearRect(0, 0, width, height);
  context.fillStyle = 'rgba(var(--color-black), 0.3)';
  context.strokeStyle = context.fillStyle;
  context.globalCompositeOperation = 'overlay';
  context.lineWidth = 1;
  context.globalAlpha = 0.1;

  const graph = createErdosRenyi(25, 0.1);

  const leftNodes = graph.nodes.map(() => [
    (width * Math.random()) / 3,
    Math.random() * height
  ]);

  const rightNodes = graph.nodes.map(() => [
    width - (width * Math.random()) / 3,
    Math.random() * (height - 20)
  ]);

  drawNetwork(context, leftNodes, graph);
  drawNetwork(context, rightNodes, graph);
}
