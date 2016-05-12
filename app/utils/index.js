/**
 * Generates a tree structure on the form of:
 * [
 *   {
 *   	 ...node,
 *   	 children: [
 *   	   {
 *   	     ...node,
 *   	     children: [...]
 *   	   }
 *   	 ]
 *   }
 * ]
 *
 * @param  {Object[]} nodes
 * @return {Object[]} tree
 */
export function generateTreeStructure(nodes) {
  // Create a map of id -> node for retrievals later:
  const nodeMap = nodes.reduce((acc, node) => ({
    ...acc,
    [node.id]: { ...node, children: [] }
  }), {});

  return nodes.reduce((acc, { id }) => {
    const node = nodeMap[id];
    if (!node.parent) {
      acc.push(node);
    } else {
      const parent = nodeMap[node.parent];
      parent.children.push(node);
    }

    return acc;
  }, []);
}

let id = 0;
export function getRandomImage(width, height) {
  const heightOrWidth = height || width;
  return `http://unsplash.it/${width}/${heightOrWidth}/?random&pleasedontcacheme=${id++}`;
}
