import { readFile } from "fs/promises";
import axios from "axios";
import Backend, {
  defaultEnvDocument,
  EnvDocument,
  isEnvDocument,
} from "./Backend";
import Deferred from "./Deferred";
import Logger from "./Logger";
import parseCsv from "./parseCsv";
import { TerriaInit } from "./types";

export default class NodeFileBackend extends Backend {
  constructor(private directory: string) {
    super();
  }
  getEnv(logger: Logger): Deferred<EnvDocument> {
    return new Deferred((resolve) => {
      readFile(`${this.directory}/env.json`, {
        encoding: "utf-8",
      })
        .catch((err) => {
          logger.error(String(err));
          return "{}";
        })
        .then(JSON.parse)
        .catch((err) => {
          logger.error(String(err));
        })
        .then((value) => {
          if (!isEnvDocument(value)) {
            logger.error(
              "env.json の読み取りに失敗しました。設定値が不正です。"
            );
            return defaultEnvDocument;
          }
          return value;
        })
        .then(resolve);
    });
  }
  getInit(logger: Logger): Deferred<Omit<TerriaInit, "catalog">> {
    return new Deferred((resolve) => {
      readFile(`${this.directory}/init.json`, {
        encoding: "utf-8",
      })
        .catch((err) => {
          logger.error(String(err));
          return "{}";
        })
        .then(JSON.parse)
        .catch((err) => {
          logger.error(String(err));
        })
        .then(resolve);
    });
  }
  getDescriptionTemplate(logger: Logger, name: string): Deferred<string> {
    return new Deferred((resolve) => {
      readFile(`${this.directory}/descriptions/${name}.txt`, {
        encoding: "utf-8",
      })
        .catch((err) => {
          logger.error(String(err));
          return "";
        })
        .then(resolve);
    });
  }
  getFeatureInfoTemplate(logger: Logger, name: string): Deferred<string[][]> {
    return new Deferred((resolve) => {
      readFile(`${this.directory}/feature_info_templates/${name}.csv`, {
        encoding: "utf-8",
      })
        .catch((err) => {
          logger.error(String(err));
          return "";
        })
        .then(parseCsv)
        .then(resolve);
    });
  }
  getOptions(logger: Logger, name: string): Deferred<Record<string, any>> {
    return new Deferred((resolve) => {
      readFile(`${this.directory}/options/${name}.json`, {
        encoding: "utf-8",
      })
        .catch((err) => {
          logger.error(String(err));
          return "{}";
        })
        .then(JSON.parse)
        .catch((err) => {
          logger.error(String(err));
        })
        .then(resolve);
    });
  }
  getLegend(logger: Logger, name: string): Deferred<string[][]> {
    return new Deferred((resolve) => {
      readFile(`${this.directory}/legends/${name}.csv`, {
        encoding: "utf-8",
      })
        .catch((err) => {
          logger.error(String(err));
          return "";
        })
        .then(parseCsv)
        .then(resolve);
    });
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
  getCatalogMatrix(): Deferred<string[][]> {
    return new Deferred((resolve) => {
      readFile(`${this.directory}/catalog.csv`, { encoding: "utf-8" })
        .then(parseCsv)
        .then(resolve);
    });
  }
}
