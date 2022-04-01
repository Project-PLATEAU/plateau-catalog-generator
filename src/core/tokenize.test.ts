import resolveMatrix from "./resolveMatrix";
import tokenize from "./tokenize";

describe("tokenize", () => {
  it("converts matrix into tokens", () => {
    expect(
      tokenize(
        // prettier-ignore
        resolveMatrix([
["name[1]", "name[2]", "type", "options", "feature_info_template", "feature_info_template[include]", "feature_info_template[exclude]", "description", "description[0]"],
["PLATEAU Dataset", "", "group", "", "", "", "", "group_common", "plateau"],
["", "", "", "", "", "", "", "", ""],
["", "Evacuation sites", "shp", "initial_camera,shp_common", "evacuation_site", "phone_number,area", "capacity_*", "dataset_common", "evacuation site"]])
      )
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "depth": 1,
          "index": 0,
          "name": "PLATEAU Dataset",
          "props": Map {
            "name[1]" => "PLATEAU Dataset",
            "name[2]" => "",
            "type" => "group",
            "options" => "",
            "feature_info_template" => "",
            "feature_info_template[include]" => "",
            "feature_info_template[exclude]" => "",
            "description" => "group_common",
            "description[0]" => "plateau",
          },
          "tag": "",
          "type": "group",
          "url": undefined,
        },
        Object {
          "depth": 2,
          "index": 2,
          "name": "Evacuation sites",
          "props": Map {
            "name[1]" => "",
            "name[2]" => "Evacuation sites",
            "type" => "shp",
            "options" => "initial_camera,shp_common",
            "feature_info_template" => "evacuation_site",
            "feature_info_template[include]" => "phone_number,area",
            "feature_info_template[exclude]" => "capacity_*",
            "description" => "dataset_common",
            "description[0]" => "evacuation site",
          },
          "tag": "",
          "type": "shp",
          "url": undefined,
        },
      ]
    `);
  });
});
