import Backend from "../core/Backend";
import deepMerge from "../core/deepMerge";
import Deferred from "../core/Deferred";
import { Plugin } from "../core/TerriaCatalogBuilder";
import { TerriaCatalogItem } from "../core/types";

interface DeepMergePluginOptions {
  backend: Backend;
}

const deepMergePlugin =
  ({ backend }: DeepMergePluginOptions): Plugin =>
  (next) =>
  (node, parentId, logger) => {
    const deferredItem = next(node, parentId, logger);
    const deferredOptions = Deferred.all(
      node.token.options.map((o) => backend.getOptions(logger, o))
    );
    return Deferred.all([deferredItem, deferredOptions]).then(
      ([item, options]) => {
        return [item, ...options].reduce(deepMerge, {}) as TerriaCatalogItem;
      }
    );
  };

export default deepMergePlugin;
