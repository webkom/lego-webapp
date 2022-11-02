// @flow
import type { ID } from 'app/models';

type Tree<T: Object> = Array<
  T & {
    children: Tree<*>,
  }
>;

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
export function generateTreeStructure<
  T: {
    id: ID,
    parent?: ID,
  }
>(nodes: Array<T>): Tree<T> {
  // Create a map of id -> node for retrievals later:
  const tree = nodes.reduce(
    (acc, node) => ({
      ...acc,
      [node.id]: {
        ...node,
        children: [],
      },
    }),
    {}
  );

  return nodes.reduce((roots, { id }) => {
    const node = tree[id];
    if (!node.parent) {
      roots.push(node);
    } else {
      const parent = tree[node.parent];
      if (parent) {
        parent.children.push(node);
      }
    }

    return roots;
  }, []);
}
