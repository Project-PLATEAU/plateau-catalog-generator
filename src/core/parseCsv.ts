const parseCsv = ([...input]: string): string[][] => {
  let pos = 0;
  const { length } = input;
  const hasMore = () => pos < length;
  const read = () => {
    const chr = input[pos];
    pos += 1;
    return chr;
  };
  const peak = () => {
    return input[pos];
  };
  const isCellDelimiter = () => {
    return peak() === ",";
  };
  const isRowDelimiter = () => {
    const chr = peak();
    return chr === "\n" || chr === "\r";
  };
  const isDelimiter = () => {
    return isCellDelimiter() || isRowDelimiter();
  };
  const skipRowDelimiters = () => {
    while (isRowDelimiter()) read();
  };
  const readWithQuote = () => {
    let cell = "";
    let shouldCheckForDelimiter = false;
    read(); // skip reading quote.
    while (hasMore() && (!shouldCheckForDelimiter || !isDelimiter())) {
      const chr = read();
      if (chr === '"') {
        if (peak() === '"') {
          read();
          cell += chr;
          continue;
        } else {
          shouldCheckForDelimiter = true;
          continue;
        }
      }
      cell += chr;
    }
    return cell;
  };
  const readCell = () => {
    let cell = "";
    const readFn = peak() === '"' ? readWithQuote : read;
    while (hasMore() && !isDelimiter()) {
      cell += readFn();
    }
    return cell;
  };
  const readRow = () => {
    const row = [];
    row.push(readCell());
    while (hasMore() && isCellDelimiter()) {
      read(); // skip , from the previous cell.
      row.push(readCell());
    }
    skipRowDelimiters();
    return row;
  };
  const rows = [];

  while (hasMore()) {
    rows.push(readRow());
  }
  return rows;
};

export default parseCsv;
