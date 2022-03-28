import TreeBuilder from "./TreeBuilder";

describe("TreeBuilder", () => {
  it("builds a tree from the input array of tokens", () => {
    const tokens = [
      { depth: 0, testName: "foo" },
      { depth: 1, testName: "bar" },
      { depth: 2, testName: "baz" },
      { depth: 2, testName: "qux" },
      { depth: 1, testName: "quux" },
    ] as const;
    const tb = new TreeBuilder(tokens);
    const tree = tb.processNode();
    expect(tree).toEqual({
      token: tokens[0],
      children: [
        {
          token: tokens[1],
          children: [
            { token: tokens[2], children: [] },
            { token: tokens[3], children: [] },
          ],
        },
        { token: tokens[4], children: [] },
      ],
    });
  });
});
