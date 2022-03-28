import { Node } from "./TreeBuilder";

interface Token {
  depth: number;
  tag: string;
}

const makePredicate = (filterPattern: string) => {
  const filters = new Set(filterPattern.split(","));
  return (node: Node<Token>) => {
    if (node.token.tag === "*") return true;
    return filters.has(node.token.tag);
  };
};

const pruneTree = (filterPattern: string) => {
  const predicate = makePredicate(filterPattern);
  const doPruneTree = <T extends Token>(node: Node<T>): Node<T> => {
    return {
      token: node.token,
      children: node.children
        .filter(predicate)
        .map((node) => doPruneTree(node)),
    };
  };
  return doPruneTree;
};

export default pruneTree;
