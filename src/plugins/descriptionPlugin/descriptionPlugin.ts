import Deferred from "../../core/Deferred";
import isNotNullish from "../../core/isNotNullish";
import { Plugin } from "../../core/TerriaCatalogBuilder";
import DescriptionPluginBackend from "./DescriptionPluginBackend";

interface DescriptionPluginOptions {
  backend: DescriptionPluginBackend;
}

const descriptionPlugin =
  ({ backend }: DescriptionPluginOptions): Plugin =>
  (next) =>
  (node, parentId, logger) => {
    const templateName = node.token.props.get("description");
    const deferredItem = next(node, parentId, logger);
    if (!templateName) return deferredItem;
    const keys = [...node.token.props.keys()];
    const variableFields = keys
      .map((key) => /description\[(\d+)\]/.exec(key))
      .filter(isNotNullish)
      .map((match) => ({ index: Number(match[1]), key: match.input }));
    const variables = new Map(
      variableFields.map(({ index, key }) => [
        index,
        String(node.token.props.get(key)),
      ])
    );
    const deferredTemplate = backend.getDescriptionTemplate(
      logger,
      templateName
    );
    return Deferred.all([deferredItem, deferredTemplate]).then(
      ([item, template]) => {
        const description = template.replace(
          /{{(\d+)}}/g,
          (match, p1) => variables.get(Number(p1)) ?? ""
        );
        return { ...item, description };
      }
    );
  };

export default descriptionPlugin;
