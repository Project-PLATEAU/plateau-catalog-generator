import isNotNullish from "./isNotNullish";
import { Node } from "./TreeBuilder";

interface Token {
  depth: number;
}

const searchTree = <T extends Token>(
  root: Node<T>,
  predicate: (node: Node<T>) => boolean
) => {
  const filterChildren = (node: typeof root): typeof root => {
    const filteredChildren = node.children
      .map(nullableSearchTree)
      .filter(isNotNullish);

    return { token: node.token, children: filteredChildren };
  };

  const nullableSearchTree = (node: typeof root) => {
    if (predicate(node)) {
      // The current node matches the predicate.
      // Include the current node and all its descendants in the result.
      return node;
    }

    // The current node does not match the predicate, but some descendants may.
    // Search for matching descendants.
    const filteredTree = filterChildren(node);

    if (filteredTree.children.length > 0) {
      // Found one or more matching descendants.
      // Include the current node and its matching descendants in the result.
      return filteredTree;
    }
    // Neither the current node or the descendants match the predicate.
    // This node should not be included in the result.
    return null;
  };
  return filterChildren(root);
};

export default searchTree;
