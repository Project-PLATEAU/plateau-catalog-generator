export default (s: string) => {
  try {
    return [JSON.parse(s), null] as const;
  } catch (e) {
    return [null, e] as const;
  }
};
