import type { EntityId } from '@reduxjs/toolkit';

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
    id: EntityId;
    parent?: EntityId | null;
  },
>(nodes: Array<T>): Tree<T> {
  // Create a map of id -> node for retrievals later:
  const tree: { [id: EntityId]: TreeNode<T> } = nodes.reduce(
    (acc: { [id: EntityId]: TreeNode<T> }, node: T) => ({
      ...acc,
      [node.id]: { ...node, children: [] },
    }),
    {},
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

export const capitalize = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

export const isTruthy = <T>(x: T | null | undefined | false | '' | 0): x is T =>
  Boolean(x);

export const isNotNullish = <T>(v: T | null | undefined): v is T =>
  v !== null && v !== undefined;
