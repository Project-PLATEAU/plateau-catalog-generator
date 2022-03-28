type MatrixInfo = { keys: string[]; rows: Map<string, string>[] };

const resolveMatrix = (rows: string[][]): MatrixInfo => {
  const keys = rows[0] ?? [];
  const resolvedRows = rows
    .slice(1)
    .map((row) => new Map(keys.map((key, index) => [key, row[index]])));
  return { keys, rows: resolvedRows };
};

export default resolveMatrix;
