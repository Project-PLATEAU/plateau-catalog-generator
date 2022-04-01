import TestApp from "../testing/TestApp";
import featureInfoTemplatePlugin from "./featureInfoTemplatePlugin";

test("featureInfoTemplatePlugin", async () => {
  const rootDir = "./src/plugins/featureInfoTemplatePlugin/testdata";
  const initDocument = await new TestApp(rootDir, (backend) => [
    featureInfoTemplatePlugin({ backend }),
  ]).buildTerriaInitDocument();

  expect(initDocument).toMatchInlineSnapshot(`
    Object {
      "catalog": Array [
        Object {
          "featureInfoTemplate": Object {
            "template": "<table><tr><td>Name</td><td>{{name}}</td></tr><tr><td>Area (m2)</td><td>{{area}}</td></tr><tr><td>Arakawa innudation depth</td><td>{{arakawa_innudation_depth}}</td></tr><tr><td>Arakawa innudation duration</td><td>{{arakawa_innudation_duration}}</td></tr><tr><td>Kandagawa innudation depth</td><td>{{kandagawa_innudation_depth}}</td></tr><tr><td>Kandagawa innudation duration</td><td>{{kandagawa_innudation_duration}}</td></tr></table>",
          },
          "hideSource": true,
          "id": "//Feature info templates",
          "name": "Feature info templates",
          "type": "3d-tiles",
          "url": "https://example.com/tileset.json",
        },
      ],
    }
  `);
});
