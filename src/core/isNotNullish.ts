const isNotNullish = <T>(value: T): value is Exclude<T, undefined | null> => {
  return value != null;
};

export default isNotNullish;
