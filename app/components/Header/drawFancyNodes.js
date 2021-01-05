import { getFancyNodeColor } from 'app/utils/themeUtils';

function createErdosRenyi(n, p) {
  const graph = { nodes: [], edges: [] };
  for (let i = 0; i < n; i++) {
    graph.nodes.push({
      node: i,
      edgeCount: 0,
    });
    for (let j = 0; j < i; j++) {
      if (Math.random() < p) {
        graph.nodes[i].edgeCount++;
        graph.edges.push({
          source: i,
          target: j,
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

  nodes.forEach(([x, y], node) => {
    const edgeCount = graph.nodes[node].edgeCount;
    context.beginPath();
    context.arc(x, y, 4 + Math.floor(edgeCount * 4), 0, 2 * Math.PI);
    context.fill();
  });
}

export default function drawFancyNodes(context, { width, height }) {
  context.clearRect(0, 0, width, height);
  context.fillStyle = getFancyNodeColor();
  context.strokeStyle = context.fillStyle;
  context.globalCompositeOperation = 'overlay';
  context.lineWidth = 1;
  context.globalAlpha = 0.1;

  const graph = createErdosRenyi(25, 0.1);

  let leftNodes = graph.nodes.map(() => [
    (width * Math.random()) / 3,
    Math.random() * height,
  ]);

  let rightNodes = graph.nodes.map(() => [
    width - (width * Math.random()) / 3,
    Math.random() * (height - 20),
  ]);

  const leftNodeVel = graph.nodes.map(() => [
    Math.sin(Math.random() * 2 * Math.PI),
    Math.sin(Math.random() * 2 * Math.PI),
  ]);

  const rightNodeVel = graph.nodes.map(() => [
    Math.sin(Math.random() * 2 * Math.PI),
    Math.sin(Math.random() * 2 * Math.PI),
  ]);

  drawNetwork(context, leftNodes, graph);
  drawNetwork(context, rightNodes, graph);

  function updateNetwork() {
    leftNodes = leftNodes.map(([x, y], i) => [
      (x + leftNodeVel[i][0]) % (width / 3),
      (y + leftNodeVel[i][1]) % height,
    ]);
    rightNodes = rightNodes.map(([x, y], i) => [
      ((x + rightNodeVel[i][0] - (2 * width) / 3) % (width / 3)) +
        (2 * width) / 3,
      (y + rightNodeVel[i][1]) % height,
    ]);

    context.clearRect(0, 0, width, height);
    drawNetwork(context, leftNodes, graph);
    drawNetwork(context, rightNodes, graph);
  }
  return global.setInterval(updateNetwork, 100);
}
