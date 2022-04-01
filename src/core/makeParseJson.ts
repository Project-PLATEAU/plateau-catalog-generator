import Logger from "./Logger";
import { Validator } from "./validators";

const makeParseJson =
  <T, U = unknown>(
    validator: Validator<T>,
    fallback: U,
    errorMessage: string
  ) =>
  (logger: Logger) =>
  (value: string) => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(value);
    } catch (err) {
      logger.error(`${errorMessage}\n${err}`);
      return fallback;
    }
    if (!validator(parsed)) {
      logger.error(
        `${errorMessage}\n有効な JSON ドキュメントですが、必要な情報を含んでいません。`
      );
      return fallback;
    }
    return parsed;
  };

export default makeParseJson;
