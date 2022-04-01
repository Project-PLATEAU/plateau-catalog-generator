import searchTree from "./searchTree";

it("prunes the given tree so that it only includes nodes that match the specified predicate and the descendants of such nodes", () => {
  // prettier-ignore
  const original =
    { token: { depth: 1, match: true }, children: [
      { token: { depth: 2, match: true }, children: [
        { token: { depth: 3, match: false }, children: [] }
      ] },
      { token: { depth: 2, match: false }, children: [
        { token: { depth: 3, match: true }, children: [] }
      ] },
      { token: { depth: 2, match: false }, children: [] },
    ] };
  const expected = {
    token: { depth: 1, match: true },
    children: [
      {
        token: { depth: 2, match: true },
        children: [{ token: { depth: 3, match: false }, children: [] }],
      },
      {
        token: { depth: 2, match: false },
        children: [{ token: { depth: 3, match: true }, children: [] }],
      },
    ],
  };
  expect(searchTree(original, (node) => node.token.match)).toEqual(expected);
});
