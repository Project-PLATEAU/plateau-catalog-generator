import deepMerge from "./deepMerge";

describe("deepMerge()", () => {
  test.each`
    arg1               | arg2               | expected                 | description
    ${{ a: 1 }}        | ${{ b: 2 }}        | ${{ a: 1, b: 2 }}        | ${"can merge flat objects"}
    ${{ a: { b: 1 } }} | ${{ a: { c: 2 } }} | ${{ a: { b: 1, c: 2 } }} | ${"can merge nested objects"}
    ${{ a: 1 }}        | ${{ a: 2 }}        | ${{ a: 2 }}              | ${"arg2 takes precedence over arg1"}
    ${{ a: [1] }}      | ${{ a: [2, 3] }}   | ${{ a: [1, 2, 3] }}      | ${"arrays are concatenated"}
  `("$description", ({ arg1, arg2, expected }) => {
    expect(deepMerge(arg1, arg2)).toEqual(expected);
  });
});
