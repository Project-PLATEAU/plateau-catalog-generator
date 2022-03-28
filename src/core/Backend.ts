import Deferred from "./Deferred";
import Logger from "./Logger";
import { TerriaInit } from "./types";
import { array, boolean, Infer, object, string } from "./validators";

export const isEnvDocument = object({
  urlReplace: array(object([string, string] as const)),
  inspect: boolean,
  filterPattern: string,
  convertCustomProperties: boolean,
});

export type EnvDocument = Infer<typeof isEnvDocument>;

export const defaultEnvDocument: EnvDocument = {
  urlReplace: [],
  inspect: false,
  filterPattern: "",
  convertCustomProperties: true,
};
export default abstract class Backend {
  abstract getEnv(logger: Logger): Deferred<EnvDocument>;
  abstract getInit(logger: Logger): Deferred<Omit<TerriaInit, "catalog">>;
  abstract getDescriptionTemplate(
    logger: Logger,
    templateName: string
  ): Deferred<string>;
  abstract getFeatureInfoTemplate(
    logger: Logger,
    name: string
  ): Deferred<string[][]>;
  abstract getOptions(
    logger: Logger,
    name: string
  ): Deferred<Record<string, any>>;
  abstract getLegend(logger: Logger, name: string): Deferred<string[][]>;
  abstract fetch(logger: Logger, url: string): Deferred<string>;
  abstract getCatalogMatrix(logger: Logger): Deferred<string[][]>;
}
