import Deferred from "../../core/Deferred";
import Logger from "../../core/Logger";

export default interface DescriptionPluginBackend {
  getDescriptionTemplate(
    logger: Logger,
    templateName: string
  ): Deferred<string>;
}
