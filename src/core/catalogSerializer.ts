const processFragment = (fragment: any): any => {
  if (Array.isArray(fragment)) return fragment.map(processFragment);
  if (fragment === null) return null;
  if (typeof fragment === "object") {
    const keys = Object.keys(fragment);
    const shortProperties: string[] = [];
    const longProperties: string[] = [];
    const superLongProperties: string[] = [];
    keys.forEach((key) => {
      if (key === "description") {
        longProperties.push(key);
        return;
      }
      if (key === "members") {
        superLongProperties.push(key);
        return;
      }
      if (typeof fragment[key] === "object") {
        longProperties.push(key);
        return;
      }
      shortProperties.push(key);
    });
    return Object.fromEntries(
      [
        ...shortProperties.sort(),
        ...longProperties.sort(),
        ...superLongProperties.sort(),
      ].map((key) => [key, processFragment(fragment[key])])
    );
  }
  return fragment;
};

export default {
  test: (): boolean => true,
  serialize: (obj: any): string =>
    JSON.stringify(processFragment(obj), undefined, 2),
};
