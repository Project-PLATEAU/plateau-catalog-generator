import Deferred from "../../core/Deferred";
import { Plugin } from "../../core/TerriaCatalogBuilder";
import { TerriaLegendItem } from "../../core/types";
import LegendPluginBackend, { LegendEntry } from "./LegendPluginBackend";

interface LegendPluginOptions {
  backend: LegendPluginBackend;
}

const FALSY_STRINGS = ["", "0", "false"];

function buildLegendItem(mapping: LegendEntry): TerriaLegendItem {
  const target: TerriaLegendItem = {};
  const title = mapping.title;
  const maxMultipleTitlesShowed = mapping.maxMultipleTitlesShowed;
  const titleAbove = mapping.titleAbove;
  const titleBelow = mapping.titleBelow;
  const color = mapping.color;
  const outlineColor = mapping.outlineColor;
  const imageUrl = mapping.imageUrl;
  const addSpacingAbove = mapping.addSpacingAbove;
  const imageHeight = mapping.imageHeight;
  const imageWidth = mapping.imageWidth;
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

export const buildLegend = (legendRows: readonly LegendEntry[]) => {
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
      ([item, legendEntries]) => {
        const legend = buildLegend(legendEntries);
        item.legends = [legend];
        return item;
      }
    );
  };

export default legendPlugin;
