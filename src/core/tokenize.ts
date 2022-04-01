import isNotNullish from "./isNotNullish";

export interface Token {
  depth: number;
  name: string;
  type: string;
  url?: string;
  props: Map<string, string>;
  index?: number;
}

const tokenize = ({
  keys,
  rows,
}: {
  keys: string[];
  rows: Map<string, string>[];
}): Token[] => {
  const nameFields = keys
    .map((key) => /name\[(\d+)\]/.exec(key))
    .filter(isNotNullish)
    .map((match) => ({ depth: Number(match[1]), key: match.input }))
    .sort((a, b) => a.depth - b.depth);
  const tokens = rows
    .map((row, index) => {
      const maybeDepth = nameFields.find(({ key }) => row.get(key));
      if (!maybeDepth) return null;
      const { depth, key } = maybeDepth;
      const name = row.get(key) ?? "";
      const tag = row.get("tag") ?? "";
      const type = row.get("type") ?? "";
      const url = row.get("url");
      return {
        depth,
        name,
        tag,
        type,
        url,
        props: row,
        index,
      };
    })
    .filter(isNotNullish);
  return tokens;
};

export default tokenize;
