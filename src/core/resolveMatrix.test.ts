import resolveMatrix from "./resolveMatrix";

describe("resolveMatrix", () => {
  it("converts a 2D matrix into an array of mappings, where keys are taken from the matrix header.", () => {
    expect(
      resolveMatrix([
        ["depth_1", "depth_2", "type"],
        ["PLATEAU Dataset", "", "group"],
        ["", "Evacuation sites", "shp"],
      ])
    ).toEqual({
      keys: ["depth_1", "depth_2", "type"],
      rows: [
        new Map([
          ["depth_1", "PLATEAU Dataset"],
          ["depth_2", ""],
          ["type", "group"],
        ]),
        new Map([
          ["depth_1", ""],
          ["depth_2", "Evacuation sites"],
          ["type", "shp"],
        ]),
      ],
    });
  });
});
