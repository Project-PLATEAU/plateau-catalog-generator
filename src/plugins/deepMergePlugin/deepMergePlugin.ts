import deepMerge from "../../core/deepMerge";
import Deferred from "../../core/Deferred";
import { Plugin } from "../../core/TerriaCatalogBuilder";
import { TerriaCatalogItem } from "../../core/types";
import DeepMergePluginBackend from "./DeepMergePluginBackend";

interface DeepMergePluginOptions {
  backend: DeepMergePluginBackend;
}

const deepMergePlugin =
  ({ backend }: DeepMergePluginOptions): Plugin =>
  (next) =>
  (node, parentId, logger) => {
    const deferredItem = next(node, parentId, logger);
    const optionsStr = node.token.props.get("options") ?? "";
    const optionsArr = optionsStr.split(",").filter((v) => v);
    const deferredOptions = Deferred.all(
      optionsArr.map((o) => backend.getOptions(logger, o))
    );
    return Deferred.all([deferredItem, deferredOptions]).then(
      ([item, options]) => {
        return [item, ...options].reduce(deepMerge, {}) as TerriaCatalogItem;
      }
    );
  };

export default deepMergePlugin;
