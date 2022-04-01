import Deferred from "../../core/Deferred";
import Logger from "../../core/Logger";
import { MatrixEntry } from "../../core/matrix2Object";

export const legendKeys = [
  "title?",
  "maxMultipleTitlesShowed?",
  "titleAbove?",
  "titleBelow?",
  "color?",
  "outlineColor?",
  "imageUrl?",
  "addSpacingAbove?",
  "imageHeight?",
  "imageWidth?",
] as const;

export type LegendEntry = MatrixEntry<typeof legendKeys[number]>;

export default interface LegendPluginBackend {
  getLegend(logger: Logger, name: string): Deferred<LegendEntry[]>;
}
