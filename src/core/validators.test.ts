import { array, boolean, number, object, string } from "./validators";

test("validators", () => {
  const validator = object({
    a: number,
    b: boolean,
    c: array(string),
    d: array(object({ e: string })),
  });
  const validValue = {
    a: 1,
    b: true,
    c: ["a"],
    d: [{ e: "a" }],
  };
  expect(validator(validValue)).toEqual(true);

  if (validator(validValue)) {
    type ExpectedType = {
      a: number;
      b: boolean;
      c: string[];
      d: { e: string }[];
    };
    // Ensure type infers correctly.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const target: ExpectedType = validValue;
  }

  expect(validator({ ...validValue, a: null })).toEqual(false);
  expect(validator({ ...validValue, b: null })).toEqual(false);
  expect(validator({ ...validValue, c: null })).toEqual(false);
  expect(validator({ ...validValue, d: [{ e: null }] })).toEqual(false);
});
