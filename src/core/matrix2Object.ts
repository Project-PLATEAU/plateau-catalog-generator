type OptionalKey<T extends string = string> = `${T}?`;

type RequiredMatrixEntry<TKeys extends string> = {
  [TKey in Exclude<TKeys, OptionalKey>]: string;
};

type OptionalMatrixEntry<TKeys extends string> = {
  [TKey in TKeys & OptionalKey as TKey extends OptionalKey<infer T>
    ? T
    : never]?: string;
};

export type MatrixEntry<TKeys extends string> = RequiredMatrixEntry<TKeys> &
  OptionalMatrixEntry<TKeys>;

const stripOptional = <T extends string>(
  key: T
): T extends OptionalKey<infer U> ? U : T =>
  key.endsWith("?") ? key.slice(0, -1) : (key as any);

const isOptional = (key: string) => key.endsWith("?");
/**
 * Yank values from a headered two-dimensional array and pack them into an array of objects.
 * @param targetKeys Keys by which to look up values in the two-dimensional array.
 *                   Keys are by default treated as required.
 *                   A key ending with "?" denotes an optional key.
 * @returns An array of objects if all the required keys are met, or null otherwise.
 */
const matrix2Object =
  <TKeys extends string>(targetKeys: readonly TKeys[]) =>
  (rows: string[][]): null | MatrixEntry<TKeys>[] => {
    const header = rows[0];
    if (!header) return null;
    const keyMeta = targetKeys.map((keyString) => {
      const optional = isOptional(keyString);
      const name = stripOptional(keyString);
      const positionInRow = header.indexOf(name);
      return { name, optional, positionInRow };
    });
    const entries: MatrixEntry<TKeys>[] = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const entry = {} as MatrixEntry<TKeys>;
      for (let j = 0; j < keyMeta.length; j++) {
        const { name, optional, positionInRow } = keyMeta[j];
        const value = row[positionInRow];
        if (!optional && value == null) return null;
        Object.defineProperty(entry, name, {
          value,
          configurable: true,
          enumerable: true,
          writable: true,
        });
      }
      entries.push(entry);
    }
    return entries;
  };

export default matrix2Object;
