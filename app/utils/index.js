// @flow

type Tree<T: Object> = Array<T & {
  children: Tree<*>
}>;

/**
 * Generates a tree structure on the form of
 *
 * ```
 * [{
 *   ...node,
 *   children: [{
 *     ...node,
 *     children: [...]
 *   }]
 * }]
 *
 * @param  {Object[]} nodes
 * @return {Object[]} tree
 */
export function generateTreeStructure<T: {
  id: string,
  parent: string
}>(nodes: Array<T>): Tree<T> {
  // Create a map of id -> node for retrievals later:
  const tree = nodes.reduce((acc, node) => ({
    ...acc,
    [node.id]: {
      ...node,
      children: []
    }
  }), {});

  return nodes.reduce((roots, { id }) => {
    const node = tree[id];
    if (!node.parent) {
      roots.push(node);
    } else {
      const parent = tree[node.parent];
      parent.children.push(node);
    }

    return roots;
  }, []);
}

let id = 0;
export function getRandomImage(width: number, height: number) {
  const heightOrWidth = height || width;
  return `http://unsplash.it/${width}/${heightOrWidth}/?random&pleasedontcacheme=${id++}`;
}

export function getImage(id, width = 320, height = 240) {
  return `http://unsplash.it/${width}/${height}/?image=${id}`;
}
