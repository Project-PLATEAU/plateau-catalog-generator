import { Plugin } from "../core/TerriaCatalogBuilder";
import { TerriaShortReportSection } from "../core/types";

const defaultTemplate = (opendataUrl: string) =>
  `<a href="${opendataUrl}" style='background:#00bebe;text-decoration:none;display:block;padding:8px 16px;text-align:center;color:white;border-radius:4px;'>オープンデータを入手</a>`;

const opendataInShortReportSectionsPlugin =
  ({ template = defaultTemplate, columnName = "opendata" } = {}): Plugin =>
  (next) =>
  (node, parentId, logger) => {
    return next(node, parentId, logger).then((item) => {
      const opendataUrl = node.token.props.get(columnName);
      if (!opendataUrl) return item;
      const opendataUrlSection: TerriaShortReportSection = {
        name: "_",
        content: template(opendataUrl),
      };
      const { shortReportSections = [] } = item;
      return {
        ...item,
        shortReportSections: [...shortReportSections, opendataUrlSection],
      };
    });
  };

export default opendataInShortReportSectionsPlugin;
