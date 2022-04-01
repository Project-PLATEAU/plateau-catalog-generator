import { DeepMergePluginBackend } from "../plugins/deepMergePlugin";
import { DescriptionPluginBackend } from "../plugins/descriptionPlugin";
import { FeatureInfoTemplatePluginBackend } from "../plugins/featureInfoTemplatePlugin";
import { LegendPluginBackend } from "../plugins/legendPlugin";
import { MvtPluginBackend } from "../plugins/mvtPlugin";
import CoreBackend from "../core/CoreBackend";

type PresetBackend = CoreBackend &
  DeepMergePluginBackend &
  DescriptionPluginBackend &
  FeatureInfoTemplatePluginBackend &
  LegendPluginBackend &
  MvtPluginBackend;

export default PresetBackend;
