import TestApp from "../testing/TestApp";
import legendPlugin from "./legendPlugin";

describe("legendPlugin", () => {
  test("basic", async () => {
    const rootDir = "./src/plugins/legendPlugin/testdata/simple";
    const initDocument = await new TestApp(rootDir, (backend) => [
      legendPlugin({ backend }),
    ]).buildTerriaInitDocument();
    expect(initDocument).toMatchInlineSnapshot(`
      Object {
        "catalog": Array [
          Object {
            "hideSource": true,
            "id": "//Test dataset",
            "legends": Array [
              Object {
                "items": Array [
                  Object {
                    "color": "#00FF00",
                    "title": "Rank 1",
                  },
                  Object {
                    "color": "#FFFF00",
                    "title": "Rank 2",
                  },
                  Object {
                    "color": "#FF0000",
                    "title": "Rank 3",
                  },
                ],
                "title": "凡例",
              },
            ],
            "name": "Test dataset",
            "type": "mvt",
            "url": "https://example.com/test.geojson",
          },
        ],
      }
    `);
  });
});
