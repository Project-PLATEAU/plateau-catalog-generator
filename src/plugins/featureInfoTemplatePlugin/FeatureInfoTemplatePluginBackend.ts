import Deferred from "../../core/Deferred";
import Logger from "../../core/Logger";
import { MatrixEntry } from "../../core/matrix2Object";

export const featureInfoTemplateKeys = [
  "name",
  "property",
  "default?",
] as const;

export type FeatureInfoTemplateEntry = MatrixEntry<
  typeof featureInfoTemplateKeys[number]
>;

export default interface FeatureInfoTemplatePluginBackend {
  getFeatureInfoTemplate(
    logger: Logger,
    name: string
  ): Deferred<FeatureInfoTemplateEntry[]>;
}
