import matrix2Object from "./matrix2Object";

test("matrix2Object", () => {
  expect(
    matrix2Object(["foo", "bar?"])([
      ["bar", "foo"],
      ["a", "b"],
      ["c", "d"],
    ])
  ).toEqual([
    { bar: "a", foo: "b" },
    { bar: "c", foo: "d" },
  ]);
  expect(
    matrix2Object(["foo", "bar?"])([["bar", "foo"], ["a", "b"], ["c"]])
  ).toEqual(null);
  expect(
    matrix2Object(["foo", "bar?"])([["foo", "bar"], ["a", "b"], ["c"]])
  ).toEqual([
    { foo: "a", bar: "b" },
    { foo: "c", bar: undefined },
  ]);
  expect(matrix2Object(["foo", "bar?"])([])).toEqual(null);
});
