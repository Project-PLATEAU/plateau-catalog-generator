import { Plugin } from "../core/TerriaCatalogBuilder";

interface ReplaceStringConfig {
  /** [searchValue, replaceValue] pairs. */
  patterns: (readonly [string, string])[];
}

const isObject = (
  value: unknown
): value is Record<string | number | symbol, unknown> => {
  return value !== null && typeof value === "object";
};

const replaceString = (
  patterns: (readonly [string, string])[],
  value: string
) =>
  patterns.reduce(
    (acc, [searchValue, replaceValue]) =>
      acc.split(searchValue).join(replaceValue), // replaceAll() alternative.
    value
  );

const recursivelyReplaceString = <T>(
  patterns: (readonly [string, string])[]
): ((value: T) => T) => {
  const doRecursivelyReplaceString = (item: any): any => {
    if (isObject(item)) {
      if (Array.isArray(item)) {
        return item.map(doRecursivelyReplaceString);
      }
      return Object.fromEntries(
        Object.entries(item).map(([k, v]) => [
          k,
          k === "members" ? v : doRecursivelyReplaceString(v),
          // Exclude "members" to avoid recursing into it.
        ])
      );
    }
    if (typeof item === "string") {
      return replaceString(patterns, item);
    }
    return item;
  };
  return doRecursivelyReplaceString;
};

const replaceUrlPlugin =
  (config: ReplaceStringConfig): Plugin =>
  (next) =>
  (node, parentId, logger) => {
    const replacedNode = {
      token: {
        ...node.token,
        url: node.token.url && replaceString(config.patterns, node.token.url),
      },
      children: node.children,
    };
    return next(replacedNode, parentId, logger).then(
      recursivelyReplaceString(config.patterns)
    );
  };

export default replaceUrlPlugin;
