import isNotNullish from "./isNotNullish";

export interface Token {
  depth: number;
  name: string;
  tag: string;
  type: string;
  url?: string;
  options: string[];
  descriptionTemplateName: string;
  descriptionVariables: Map<number, string>;
  featureInfoTemplateName: string;
  featureInfoTemplateInclude: string[];
  featureInfoTemplateExclude: string[];
  props: Map<string, string>;
  index?: number;
}

const asis = (value: unknown) => value;

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
  const descriptionVariableFields = keys
    .map((key) => /description\[(\d+)\]/.exec(key))
    .filter(isNotNullish)
    .map((match) => ({ index: Number(match[1]), key: match.input }));
  const tokens = rows
    .map((row, index) => {
      const maybeDepth = nameFields.find(({ key }) => row.get(key));
      if (!maybeDepth) return null;
      const { depth, key } = maybeDepth;
      const name = row.get(key) ?? "";
      const tag = row.get("tag") ?? "";
      const type = row.get("type") ?? "";
      const url = row.get("url");
      const options = (row.get("options") ?? "").split(",").filter(asis);
      const descriptionTemplateName = row.get("description") || "";
      const descriptionVariables = new Map(
        descriptionVariableFields.map(({ index, key }) => [
          index,
          String(row.get(key)),
        ])
      );
      const featureInfoTemplateName = row.get("feature_info_template") ?? "";
      const featureInfoTemplateInclude = (
        row.get("feature_info_template[include]") ?? ""
      )
        .split(",")
        .filter(asis);
      const featureInfoTemplateExclude = (
        row.get("feature_info_template[exclude]") ?? ""
      )
        .split(",")
        .filter(asis);
      return {
        depth,
        name,
        tag,
        type,
        url,
        options,
        descriptionTemplateName,
        descriptionVariables,
        featureInfoTemplateName,
        featureInfoTemplateInclude,
        featureInfoTemplateExclude,
        props: row,
        index,
      };
    })
    .filter(isNotNullish);
  return tokens;
};

export default tokenize;
