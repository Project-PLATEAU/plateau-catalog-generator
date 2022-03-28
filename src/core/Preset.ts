import convertCustomPropertiesPlugin from "../plugins/convertCustomPropertiesPlugin";
import deepMergePlugin from "../plugins/deepMergePlugin";
import inspectPlugin from "../plugins/legendPlugin/inspectPlugin/inspectPlugin";
import legendPlugin from "../plugins/legendPlugin/legendPlugin";
import mvtPlugin from "../plugins/mvtPlugin/mvtPlugin";
import opendataPlugin from "../plugins/opendataPlugin";
import renameShortReportSectionsPlugin from "../plugins/renameShortReportSectionsPlugin";
import replaceUrlPlugin from "../plugins/replaceUrlPlugin";
import App from "./App";
import Backend, { EnvDocument } from "./Backend";
import Deferred from "./Deferred";
import Logger from "./Logger";
import { TerriaInit } from "./types";

const isNotFalse = (p: unknown): p is Exclude<false, typeof p> => p !== false;

/**
 * A recommended configuration of the App class.
 */
export default class Preset {
  logger = new Logger();
  constructor(
    private readonly backend: Backend,
    private readonly overrides?: Partial<EnvDocument>
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
        mergedConfig.convertCustomProperties && convertCustomPropertiesPlugin(),
        // convertCustomPropertiesPlugin should be placed after all the plugins that
        // could emit items with `customProperties`.
        opendataPlugin(),
        renameShortReportSectionsPlugin(),
        // renameShortReportSectionsPlugin should be placed after all the plugins that
        // could emit items with `shortReportSections`.
        replaceUrlPlugin({ patterns: mergedConfig.urlReplace }),
        // replaceUrlPlugin should be placed after all the plugins that could
        // emit URLs like "{{prefix}}/foo/bar.json".
        mergedConfig.inspect && inspectPlugin(),
      ];
      const app = new App(this.logger, backend, {
        plugins: plugins.filter(isNotFalse),
        filterPattern: mergedConfig.filterPattern,
      });

      return app.buildTerriaInitDocument(...args);
    });
  }
}
