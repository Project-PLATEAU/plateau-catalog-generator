import { Plugin } from "../core/TerriaCatalogBuilder";
import { object } from "../core/validators";

const isObject = object({});

const convertCustomPropertiesPlugin =
  (): Plugin => (next) => (node, parentId, logger) => {
    return next(node, parentId, logger).then((item) => {
      const { customProperties, shortReportSections = [], ...rest } = item;
      if (!isObject(customProperties)) return item;
      const entries = Object.entries(customProperties).map(
        ([k, v]): [string | null, unknown] => {
          // Return a [key, value] pair for constructing the customProperties object.
          //
          // Special cases some properties that should be put in the shortReportSections
          // magic comments rather than the customProperties object.
          // For those properties, key of the returned [key, value] pair is null.
          switch (k) {
            case "dynamicColorBuilding": {
              return [
                null,
                `<!-- DYNAMIC_COLOR_BUILDING=${JSON.stringify(v)} -->`,
              ];
            }
            case "opacityControlable": {
              return [null, `<!-- OPACITY_CONTROLABLE -->`];
            }
            case "timeline": {
              return [null, `<!-- TIMELINE=${JSON.stringify(v)} -->`];
            }
            case "initialCamera": {
              return [null, `<!-- INITIAL_CAMERA=${JSON.stringify(v)} -->`];
            }
            case "switchableUrls": {
              return [null, `<!-- URL_SWITCHABLE=${JSON.stringify(v)} -->`];
            }
            case "panasonicVrMarker": {
              return [
                null,
                `<!-- PANASONIC_VR_MARKER=${JSON.stringify(v)} -->`,
              ];
            }
            default: {
              return [k, v];
            }
          }
        }
      );
      const magicComments = entries
        .filter((kv): kv is [null, unknown] => kv[0] === null)
        .map(([, v]) => v)
        .join(" ");
      const restCustomProperties = Object.fromEntries(
        entries.filter((kv): kv is [string, unknown] => kv[0] !== null)
      );
      if (item.type !== "geojson" && Object.keys(restCustomProperties).length)
        rest.customProperties = restCustomProperties;

      return {
        ...rest,
        shortReportSections: [
          {
            name: "_",
            content: magicComments,
            show: true,
          },
          ...shortReportSections,
        ],
      };
    });
  };

export default convertCustomPropertiesPlugin;
