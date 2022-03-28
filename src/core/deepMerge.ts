function isPlainObject(value: unknown): value is Record<any, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const deepMerge = <T, U>(a: T, b: U): T & U => {
  const target = { ...a };
  Object.entries(b).forEach(([key, value]) => {
    const targetValue = (target as any)[key];
    if (Array.isArray(targetValue) && Array.isArray(value)) {
      Object.defineProperty(target, key, {
        configurable: true,
        enumerable: true,
        value: [...targetValue, ...value],
        writable: true,
      });
    } else if (isPlainObject(targetValue) && isPlainObject(value)) {
      // Unlike assignment expressions, Object.defineProperty does not fire setters.
      // let a = {};
      // a["__proto__"] = 1;
      // a["__proto__"] !== 1; // because the default __proto__ setter ignores non-object values.
      // Object.defineProperty(a, "__proto__", {configurable:true, enumerable: true, value: 1, writable: true})
      // a["__proto__"] !== 1; // the default __proto__ property is overwritten.
      Object.defineProperty(target, key, {
        configurable: true,
        enumerable: true,
        value: deepMerge(targetValue, value),
        writable: true,
      });
    } else {
      Object.defineProperty(target, key, {
        configurable: true,
        enumerable: true,
        value,
        writable: true,
      });
    }
  });
  return target as any; // target now has properties from U
};

export default deepMerge;
