export type Validator<T> = (value: unknown) => value is T;

export type Infer<TValidator extends Validator<unknown>> =
  TValidator extends Validator<infer T> ? T : never;

export function object<
  T extends Record<string, Validator<any>> | Record<number, Validator<any>>
>(shape: T) {
  return (
    value: unknown
  ): value is {
    [K in keyof T]: T[K] extends Validator<infer U> ? U : never;
  } => {
    if (value === null) return false;
    if (typeof value !== "object") return false;
    return Object.entries(shape).every(([propertyName, validator]) => {
      const isValid = validator((value as any)[propertyName]);
      return isValid;
    });
  };
}

export function optional<T>(subValidator: Validator<T>) {
  return (value: unknown): value is T | undefined => {
    return value === undefined || subValidator(value);
  };
}

export function array<T>(subValidator: Validator<T>) {
  return (value: unknown): value is T[] => {
    if (!Array.isArray(value)) return false;
    return value.every((v) => {
      const isValid = subValidator(v);
      return isValid;
    });
  };
}

export function number(value: unknown): value is number {
  return typeof value === "number";
}

export function string(value: unknown): value is string {
  return typeof value === "string";
}

export function boolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}
