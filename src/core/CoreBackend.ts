import Deferred from "./Deferred";
import Logger from "./Logger";
import { TerriaInit } from "./types";
import { array, boolean, object, optional, string } from "./validators";

export const isEnvDocument = object({
  urlReplace: optional(array(object([string, string] as const))),
  inspect: optional(boolean),
});

export type EnvDocument = {
  urlReplace?: (readonly [string, string])[];
  inspect?: boolean;
};

export default abstract class CoreBackend {
  abstract getEnv(logger: Logger): Deferred<EnvDocument>;
  abstract getInit(logger: Logger): Deferred<Omit<TerriaInit, "catalog">>;
  abstract getCatalogMatrix(logger: Logger): Deferred<string[][]>;
}
