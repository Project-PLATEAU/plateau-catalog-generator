import { Plugin } from "../core/TerriaCatalogBuilder";

const renameShortReportSectionsPlugin =
  (): Plugin => (next) => (node, parentId, logger) => {
    return next(node, parentId, logger).then((item) => {
      const { shortReportSections } = item;
      if (!shortReportSections) return item;
      const namesInUse = new Set();
      const renamedShortReportSections = shortReportSections.map((section) => {
        let name = section.name;
        for (let num = 2; namesInUse.has(name); num++) {
          name = `${section.name}_${num}`;
        }
        namesInUse.add(name);
        return {
          ...section,
          name,
        };
      });
      return { ...item, shortReportSections: renamedShortReportSections };
    });
  };

export default renameShortReportSectionsPlugin;
