import Deferred from "../../core/Deferred";
import Logger from "../../core/Logger";

export default interface DeepMergePluginBackend {
  getOptions(logger: Logger, name: string): Deferred<Record<string, any>>;
}
