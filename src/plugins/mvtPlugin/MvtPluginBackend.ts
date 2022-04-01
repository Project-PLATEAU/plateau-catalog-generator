import Deferred from "../../core/Deferred";
import Logger from "../../core/Logger";
import { MatrixEntry } from "../../core/matrix2Object";
import { LegendPluginBackend } from "../legendPlugin";
import { legendKeys } from "../legendPlugin/LegendPluginBackend";

export const mvtLegendKeys = [
  ...legendKeys,
  "mvtLayer?",
  "mvtAlwaysShow?",
  "mvtLayerOrder?",
  "mvtLayer?",
  "mvtFillColor?",
  "mvtLineColor?",
  "mvtLineWidth?",
  "mvtFilter?",
] as const;

export type MvtLegendEntry = MatrixEntry<typeof mvtLegendKeys[number]>;

export default interface MvtPluginBackend extends LegendPluginBackend {
  getLegend(logger: Logger, name: string): Deferred<MvtLegendEntry[]>;
  fetch(logger: Logger, url: string): Deferred<string>;
}
