import TestApp from "../testing/TestApp";
import deepMergePlugin from "./deepMergePlugin";

test("deepMergePlugin", async () => {
  const rootDir = "./src/plugins/deepMergePlugin/testdata";
  const initDocument = await new TestApp(rootDir, (backend) => [
    deepMergePlugin({ backend }),
  ]).buildTerriaInitDocument();

  expect(initDocument).toMatchInlineSnapshot(`
    Object {
      "catalog": Array [
        Object {
          "hideSource": true,
          "id": "//Test dataset",
          "name": "Test dataset",
          "style": Object {
            "marker-size": "small",
            "marker-url": "https://example.com/park_icon.png",
          },
          "type": "geojson",
          "url": "https://example.com/park.geojson",
        },
      ],
    }
  `);
});
