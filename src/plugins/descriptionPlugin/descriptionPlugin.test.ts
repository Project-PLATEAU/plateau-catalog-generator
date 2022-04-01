import TestApp from "../testing/TestApp";
import descriptionPlugin from "./descriptionPlugin";

test("descriptionPlugin", async () => {
  const rootDir = "./src/plugins/descriptionPlugin/testdata";
  const initDocument = await new TestApp(rootDir, (backend) => [
    descriptionPlugin({ backend }),
  ]).buildTerriaInitDocument();

  expect(initDocument).toMatchInlineSnapshot(`
    Object {
      "catalog": Array [
        Object {
          "description": "This is a description of foo. bar",
          "id": "//Group 1",
          "members": Array [],
          "name": "Group 1",
          "type": "group",
        },
        Object {
          "id": "//Group 2",
          "members": Array [],
          "name": "Group 2",
          "type": "group",
        },
      ],
    }
  `);
});
