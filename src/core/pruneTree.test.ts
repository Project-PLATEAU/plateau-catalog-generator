import pruneTree from "./pruneTree";

describe("pruneTree", () => {
  it("selects only the nodes matche the given filter", () => {
    expect(
      pruneTree("a,b")({
        token: { depth: 1, tag: "a" },
        children: [
          {
            token: { depth: 2, tag: "b" },
            children: [
              {
                token: {
                  depth: 3,
                  tag: "*",
                },
                children: [],
              },
            ],
          },
          {
            token: { depth: 2, tag: "d" },
            children: [
              {
                token: {
                  depth: 3,
                  tag: "e",
                },
                children: [],
              },
            ],
          },
        ],
      })
    ).toEqual({
      token: { depth: 1, tag: "a" },
      children: [
        {
          token: { depth: 2, tag: "b" },
          children: [
            {
              token: { depth: 3, tag: "*" },
              children: [],
            },
          ],
        },
      ],
    });
  });
});
