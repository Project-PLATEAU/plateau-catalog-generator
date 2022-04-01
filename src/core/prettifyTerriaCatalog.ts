const prettifyTerriaCatalog = <T>(fragment: T): T => {
  if (Array.isArray(fragment))
    return fragment.map(prettifyTerriaCatalog) as any;
  if (fragment === null) return null as any;
  if (typeof fragment === "object") {
    const headProperties: string[] = [];
    const shortProperties: string[] = [];
    const longProperties: string[] = [];
    const superLongProperties: string[] = [];
    Object.keys(fragment).forEach((key) => {
      if (key === "id" || key === "name" || key === "type") {
        headProperties.push(key);
        return;
      }
      if (key === "description") {
        longProperties.push(key);
        return;
      }
      if (key === "members") {
        superLongProperties.push(key);
        return;
      }
      if (typeof (fragment as any)[key] === "object") {
        longProperties.push(key);
        return;
      }
      shortProperties.push(key);
    });
    return Object.fromEntries(
      [
        ...headProperties.sort(),
        ...shortProperties.sort(),
        ...longProperties.sort(),
        ...superLongProperties.sort(),
      ].map((key) => [key, prettifyTerriaCatalog((fragment as any)[key])])
    ) as T;
  }
  return fragment;
};

export default prettifyTerriaCatalog;
