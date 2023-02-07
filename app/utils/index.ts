import type { ID } from 'app/store/models';

export type Tree<T> = Array<
  T & {
    children: Tree<T>;
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
  T extends {
    id: ID;
    parent?: ID;
  }
>(nodes: Array<T>): Tree<T> {
  // Create a map of id -> node for retrievals later:
  const tree = nodes.reduce(
    (acc, node) => ({ ...acc, [node.id]: { ...node, children: [] } }),
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
