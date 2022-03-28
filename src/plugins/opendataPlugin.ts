import deepMerge from "../core/deepMerge";
import { Plugin } from "../core/TerriaCatalogBuilder";

const opendataPlugin =
  ({ columnName = "opendata" } = {}): Plugin =>
  (next) =>
  (node, parentId, logger) => {
    return next(node, parentId, logger).then((item) => {
      const opendataUrl = node.token.props.get(columnName);
      if (!opendataUrl) return item;
      return deepMerge(item, { customProperties: { opendata: opendataUrl } });
    });
  };

export default opendataPlugin;
