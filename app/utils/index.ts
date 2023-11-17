import type { ID } from 'app/store/models';

type TreeNode<T> = T & {
  children: Tree<T>;
};

export type Tree<T> = Array<TreeNode<T>>;

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
  const tree: { [id: ID]: TreeNode<T> } = nodes.reduce(
    (acc: { [id: ID]: TreeNode<T> }, node: T) => ({
      ...acc,
      [node.id]: { ...node, children: [] },
    }),
    {}
  );

  return nodes.reduce((roots: Tree<T>, { id }) => {
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

export const isDefined = <T>(v: T | null | undefined): v is T => {
  return v !== null && v !== undefined;
};
