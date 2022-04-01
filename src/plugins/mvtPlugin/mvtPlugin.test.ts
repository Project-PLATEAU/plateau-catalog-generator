import Deferred from "../../core/Deferred";
import mvtPlugin from "./mvtPlugin";
import fs from "fs/promises";
import { jest } from "@jest/globals";
import TestApp from "../testing/TestApp";

describe("mvtPlugin", () => {
  test("simple fill and stroke", async () => {
    const rootDir = "./src/plugins/mvtPlugin/testdata/simple";
    const initDocument = await new TestApp(rootDir, (backend) => [
      mvtPlugin({ backend }),
    ]).buildTerriaInitDocument();
    expect(initDocument).toMatchInlineSnapshot(`
      Object {
        "catalog": Array [
          Object {
            "description": "- ❌ : metadata.json の読み取りに失敗しました。
      SyntaxError: Unexpected end of JSON input

      ",
            "hideSource": true,
            "id": "//Test dataset",
            "legends": Array [
              Object {
                "items": Array [
                  Object {},
                  Object {},
                  Object {},
                ],
                "title": "凡例",
              },
            ],
            "name": "❌Test dataset",
            "style": Object {
              "layers": Array [
                Object {
                  "paint": Object {
                    "fill-color": "#0066ff",
                  },
                  "source-layer": "layer_1",
                  "type": "fill",
                },
                Object {
                  "filter": Array [
                    "==",
                    "class",
                    "203",
                  ],
                  "paint": Object {
                    "line-color": "#00ff00",
                    "line-width": 1,
                  },
                  "source-layer": "layer_3",
                  "type": "line",
                },
                Object {
                  "paint": Object {
                    "line-color": "#ff0000",
                    "line-width": 1,
                  },
                  "source-layer": "layer_2",
                  "type": "line",
                },
              ],
            },
            "type": "mvt",
            "url": "https://example.com/{z}/{x}/{y}.mvt",
          },
        ],
      }
    `);
  });
  test("Paint type (fill or stroke) is automatically determined from metadata.json", async () => {
    const rootDir = "./src/plugins/mvtPlugin/testdata/metadata";
    const app = new TestApp(rootDir, (backend) => [mvtPlugin({ backend })]);
    app.backend.fetch = jest.fn(
      () =>
        new Deferred((resolve) =>
          fs
            .readFile(rootDir + "/metadata.json", { encoding: "utf-8" })
            .then(resolve)
        )
    );
    const initDocument = await app.buildTerriaInitDocument();
    expect(app.backend.fetch).toHaveBeenCalledWith(
      expect.anything(),
      "https://example.com/metadata.json"
    );
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
                    "color": "#0066ff",
                  },
                  Object {
                    "color": "#ff0000",
                  },
                ],
                "title": "凡例",
              },
            ],
            "name": "Test dataset",
            "rectangle": Object {
              "east": 139.98891884,
              "north": 35.873313839999994,
              "south": 35.475433560000006,
              "west": 139.49303156,
            },
            "style": Object {
              "layers": Array [
                Object {
                  "paint": Object {
                    "fill-color": "#0066ff",
                  },
                  "source-layer": "park",
                  "type": "fill",
                },
                Object {
                  "paint": Object {
                    "fill-color": "#ff0000",
                  },
                  "source-layer": "landuse",
                  "type": "fill",
                },
              ],
            },
            "type": "mvt",
            "url": "https://example.com/{z}/{x}/{y}.mvt",
          },
        ],
      }
    `);
  });
  test("Layer list is automatically determined from metadata.json", async () => {
    const rootDir = "./src/plugins/mvtPlugin/testdata/auto";
    const app = new TestApp(rootDir, (backend) => [mvtPlugin({ backend })]);
    app.backend.fetch = jest.fn(
      () =>
        new Deferred((resolve) =>
          fs
            .readFile(rootDir + "/metadata.json", { encoding: "utf-8" })
            .then(resolve)
        )
    );
    const initDocument = await app.buildTerriaInitDocument();
    expect(app.backend.fetch).toHaveBeenCalledWith(
      expect.anything(),
      "https://example.com/metadata.json"
    );
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
                    "color": "hsl(0 100% 50%)",
                    "title": "park",
                  },
                  Object {
                    "color": "hsl(180 100% 50%)",
                    "title": "landuse",
                  },
                ],
                "title": "凡例",
              },
            ],
            "name": "Test dataset",
            "rectangle": Object {
              "east": 139.98891884,
              "north": 35.873313839999994,
              "south": 35.475433560000006,
              "west": 139.49303156,
            },
            "style": Object {
              "layers": Array [
                Object {
                  "paint": Object {
                    "fill-color": "hsl(0 100% 50%)",
                  },
                  "source-layer": "park",
                  "type": "fill",
                },
                Object {
                  "paint": Object {
                    "fill-color": "hsl(180 100% 50%)",
                  },
                  "source-layer": "landuse",
                  "type": "fill",
                },
              ],
            },
            "type": "mvt",
            "url": "https://example.com/{z}/{x}/{y}.mvt",
          },
        ],
      }
    `);
  });
});
