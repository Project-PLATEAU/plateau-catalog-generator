import { readFile } from "fs/promises";
import axios from "axios";
import { EnvDocument, isEnvDocument } from "../core/CoreBackend";
import Deferred from "../core/Deferred";
import Logger from "../core/Logger";
import parseCsv from "../core/parseCsv";
import { TerriaInit } from "../core/types";
import PresetBackend from "./PresetBackend";
import matrix2Object, { MatrixEntry } from "../core/matrix2Object";
import {
  MvtLegendEntry,
  mvtLegendKeys,
} from "../plugins/mvtPlugin/MvtPluginBackend";
import { object, Validator } from "../core/validators";
import makeParseJson from "../core/makeParseJson";
import {
  FeatureInfoTemplateEntry,
  featureInfoTemplateKeys,
} from "../plugins/featureInfoTemplatePlugin/FeatureInfoTemplatePluginBackend";

const defaultEnvDocument = {
  urlReplace: undefined,
  inspect: false,
};
export default class NodeFileBackend implements PresetBackend {
  constructor(private directory: string) {}
  private readLocalFile(
    logger: Logger,
    path: string,
    fallbackContent: string
  ): Deferred<string> {
    return new Deferred((resolve) => {
      readFile(`${this.directory}/${path}`, {
        encoding: "utf-8",
      })
        .catch((err) => {
          logger.error(String(err));
          return fallbackContent;
        })
        .then(resolve);
    });
  }
  private readJsonFile<T>(
    logger: Logger,
    path: string,
    validator: Validator<T>,
    fallback: T
  ): Deferred<T> {
    return this.readLocalFile(logger, path, "{}").then(
      makeParseJson(
        validator,
        fallback,
        `${path} の読み取りに失敗しました。`
      )(logger)
    );
  }
  private readCsvFile<TKeys extends string>(
    logger: Logger,
    path: string,
    keys: readonly TKeys[]
  ): Deferred<MatrixEntry<TKeys>[]> {
    return this.readLocalFile(logger, path, "")
      .then(parseCsv)
      .then(matrix2Object(keys))
      .then((entries) => entries ?? []);
  }
  getEnv(logger: Logger): Deferred<EnvDocument> {
    return this.readJsonFile(
      logger,
      "env.json",
      isEnvDocument,
      defaultEnvDocument
    );
  }
  getInit(logger: Logger): Deferred<Omit<TerriaInit, "catalog">> {
    return this.readJsonFile(logger, "init.json", object({}), {});
  }
  getCatalogMatrix(): Deferred<string[][]> {
    return new Deferred((resolve) => {
      readFile(`${this.directory}/catalog.csv`, { encoding: "utf-8" })
        .then(parseCsv)
        .then(resolve);
    });
  }
  getDescriptionTemplate(logger: Logger, name: string): Deferred<string> {
    return this.readLocalFile(logger, `descriptions/${name}.txt`, "");
  }
  getFeatureInfoTemplate(
    logger: Logger,
    name: string
  ): Deferred<FeatureInfoTemplateEntry[]> {
    return this.readCsvFile(
      logger,
      `feature_info_templates/${name}.csv`,
      featureInfoTemplateKeys
    );
  }

  getOptions(logger: Logger, name: string): Deferred<Record<string, any>> {
    return this.readJsonFile(logger, `options/${name}.json`, object({}), {});
  }
  getLegend(logger: Logger, name: string): Deferred<MvtLegendEntry[]> {
    return this.readCsvFile(logger, `legends/${name}.csv`, mvtLegendKeys);
  }
  fetch(logger: Logger, url: string): Deferred<string> {
    return new Deferred((resolve) => {
      axios
        .get(url, {
          responseType: "text",
          transitional: { forcedJSONParsing: false },
        })
        .then(
          (response) => {
            if (response.status !== 200)
              logger.error(
                `${url} から有効なレスポンスを得られませんでした。HTTP ステータスコード: ${response.status}`
              );
            return response.data;
          },
          () => {
            logger.error(`${url} に接続できません。`);
            return "";
          }
        )
        .then(resolve);
    });
  }
}
