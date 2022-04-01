import deepMergePlugin from "../plugins/deepMergePlugin";
import descriptionPlugin from "../plugins/descriptionPlugin";
import featureInfoTemplatePlugin from "../plugins/featureInfoTemplatePlugin";
import inspectPlugin from "../plugins/inspectPlugin";
import legendPlugin from "../plugins/legendPlugin";
import mvtPlugin from "../plugins/mvtPlugin";
import opendataPlugin from "../plugins/opendataPlugin";
import renameShortReportSectionsPlugin from "../plugins/renameShortReportSectionsPlugin";
import replaceUrlPlugin from "../plugins/replaceUrlPlugin";
import App from "../core/App";
import { EnvDocument } from "../core/CoreBackend";
import Deferred from "../core/Deferred";
import Logger from "../core/Logger";
import PresetBackend from "./PresetBackend";
import { TerriaInit } from "../core/types";

const isTruthy = <T>(p: false | T): p is T => p !== false;

/**
 * A recommended configuration of the App class.
 */
export default class Preset {
  logger = new Logger();
  constructor(
    private readonly backend: PresetBackend,
    private readonly overrides?: EnvDocument
  ) {}
  buildTerriaInitDocument(
    ...args: Parameters<App["buildTerriaInitDocument"]>
  ): Deferred<TerriaInit> {
    const { backend } = this;
    return backend.getEnv(this.logger).then((config) => {
      const mergedConfig = { ...config, ...this.overrides };
      const plugins = [
        legendPlugin({ backend }),
        mvtPlugin({ backend }),
        deepMergePlugin({ backend }),
        opendataPlugin(),
        descriptionPlugin({ backend }),
        featureInfoTemplatePlugin({ backend }),
        renameShortReportSectionsPlugin(),
        // renameShortReportSectionsPlugin should be placed after all the plugins that
        // could emit items with `shortReportSections`.
        replaceUrlPlugin({ patterns: mergedConfig.urlReplace ?? [] }),
        // replaceUrlPlugin should be placed after all the plugins that could
        // emit URLs like "{{prefix}}/foo/bar.json".
        !!mergedConfig.inspect && inspectPlugin(),
      ];
      const app = new App(this.logger, backend, {
        plugins: plugins.filter(isTruthy),
      });

      return app.buildTerriaInitDocument(...args);
    });
  }
}
