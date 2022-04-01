import { isMatch } from "matcher";
import Deferred from "../../core/Deferred";
import { Plugin } from "../../core/TerriaCatalogBuilder";
import FeatureInfoTemplatePluginBackend from "./FeatureInfoTemplatePluginBackend";

interface FeatureInfoTemplatePluginOptions {
  backend: FeatureInfoTemplatePluginBackend;
}

const featureInfoTemplatePlugin =
  ({ backend }: FeatureInfoTemplatePluginOptions): Plugin =>
  (next) =>
  (node, parentId, logger) => {
    const deferredItem = next(node, parentId, logger);

    const name = node.token.props.get("feature_info_template") ?? "";
    const includePatterns = (
      node.token.props.get("feature_info_template[include]") ?? ""
    )
      .split(",")
      .filter((v) => v);
    const excludePatterns = (
      node.token.props.get("feature_info_template[exclude]") ?? ""
    )
      .split(",")
      .filter((v) => v);

    if (!name) return deferredItem;
    const deferredTemplate = backend
      .getFeatureInfoTemplate(logger, name)
      .then((entries) => {
        if (!entries) {
          logger.error(`属性表テンプレート ${name} の値が不正です。`);
          return null;
        }
        const innerHtml = entries
          .filter((row) => {
            if (isMatch(row.property, excludePatterns)) return false;
            if (isMatch(row.property, includePatterns)) return true;
            return row.default !== "exclude";
          })
          .map(
            (row) => `<tr><td>${row.name}</td><td>{{${row.property}}}</td></tr>`
          )
          .join("");
        const template = `<table>${innerHtml}</table>`;
        return { template };
      });
    return Deferred.all([deferredItem, deferredTemplate]).then(
      ([item, template]) => {
        if (template) item.featureInfoTemplate = template;
        return item;
      }
    );
  };

export default featureInfoTemplatePlugin;
