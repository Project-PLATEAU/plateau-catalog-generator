import Backend from "../../core/Backend";
import Deferred from "../../core/Deferred";
import resolveMatrix from "../../core/resolveMatrix";
import { Plugin } from "../../core/TerriaCatalogBuilder";
import { TerriaLegendItem } from "../../core/types";

interface LegendPluginOptions {
  backend: Backend;
}

const FALSY_STRINGS = ["", "0", "false"];

function buildLegendItem(mapping: Map<string, string>): TerriaLegendItem {
  const target: TerriaLegendItem = {};
  const title = mapping.get("title");
  const maxMultipleTitlesShowed = mapping.get("maxMultipleTitlesShowed");
  const titleAbove = mapping.get("titleAbove");
  const titleBelow = mapping.get("titleBelow");
  const color = mapping.get("color");
  const outlineColor = mapping.get("outlineColor");
  const imageUrl = mapping.get("imageUrl");
  const addSpacingAbove = mapping.get("addSpacingAbove");
  const imageHeight = mapping.get("imageHeight");
  const imageWidth = mapping.get("imageWidth");
  if (title) target.title = title;
  if (maxMultipleTitlesShowed)
    target.maxMultipleTitlesShowed = Number(maxMultipleTitlesShowed);
  if (titleAbove) target.titleAbove = titleAbove;
  if (titleBelow) target.titleBelow = titleBelow;
  if (color) target.color = color;
  if (outlineColor) target.outlineColor = outlineColor;
  if (imageUrl) target.imageUrl = imageUrl;
  if (addSpacingAbove)
    target.addSpacingAbove = !FALSY_STRINGS.includes(
      addSpacingAbove.toLowerCase()
    );
  if (imageHeight) target.imageHeight = Number(imageHeight);
  if (imageWidth) target.imageWidth = Number(imageWidth);
  return target;
}

export const buildLegend = (legendRows: Map<string, string>[]) => {
  const legend = {
    title: "凡例",
    items: legendRows.map(buildLegendItem),
  };
  return legend;
};

const legendPlugin =
  ({ backend }: LegendPluginOptions): Plugin =>
  (next) =>
  (node, parentId, logger) => {
    const deferredItem = next(node, parentId, logger);
    const legendName = node.token.props.get("legend");
    if (!legendName) return deferredItem;
    const deferredLegend = backend.getLegend(logger, legendName);
    return Deferred.all([deferredItem, deferredLegend]).then(
      ([item, legendMatrix]) => {
        const { rows } = resolveMatrix(legendMatrix);
        const legend = buildLegend(rows);
        item.legends = [legend];
        return item;
      }
    );
  };

export default legendPlugin;
