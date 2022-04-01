import { Plugin } from "../../core/TerriaCatalogBuilder";
import { TerriaCatalogItem } from "../../core/types";

const preprocessItem = (item: TerriaCatalogItem) => {
  const clone = { ...item };
  if (clone.type === "group") delete clone.members;
  return clone;
};

const replacements = new Map([
  ["<", "&lt;"],
  [">", "&gt;"],
]);

const inspectPlugin = (): Plugin => (next) => (node, parentId, logger) => {
  return next(node, parentId, logger).then((item) => {
    const { description: originalDescription = "" } = item;
    const definitionSource = JSON.stringify(preprocessItem(item), null, 2);
    const escapaedDefinitionSource = definitionSource.replace(
      /[<>]/g,
      (chr) => replacements.get(chr) ?? ""
    );
    const definitionMarkup = `<details><summary style='display: list-item;'>カタログ定義</summary><pre><code>${escapaedDefinitionSource}</code></pre></details>`;
    return {
      ...item,
      description: `${originalDescription}\n\n${definitionMarkup}`,
    };
  });
};

export default inspectPlugin;
