import { isMatch } from "matcher";
import Backend from "./Backend";
import Deferred from "./Deferred";
import Logger from "./Logger";
import resolveMatrix from "./resolveMatrix";
import { Token } from "./tokenize";
import { Node } from "./TreeBuilder";
import {
  TerriaCatalogItem,
  TerriaCompositeOrGroup,
  TerriaFeatureInfoTemplate,
} from "./types";

export interface BuildFunction {
  (
    node: Node<Token>,
    parentId: string,
    logger: Logger
  ): Deferred<TerriaCatalogItem>;
}

export interface Plugin {
  (next: BuildFunction): BuildFunction;
}

export default class TerriaCatalogBuilder {
  protected buildWithPlugins: BuildFunction;
  constructor(private backend: Backend, private plugins: Plugin[] = []) {
    this.buildWithPlugins = this.plugins.reduce(
      (acc, cur) => cur(acc),
      this.buildPerType.bind(this)
    );
  }
  protected generateDescription(
    node: Node<Token>,
    logger: Logger
  ): Deferred<string | undefined> {
    const { descriptionTemplateName, descriptionVariables } = node.token;
    if (!descriptionTemplateName)
      return new Deferred((resolve) => resolve(undefined));
    return this.backend
      .getDescriptionTemplate(logger, descriptionTemplateName)
      .then((descriptionTemplate) => {
        const description = descriptionTemplate.replace(
          /{{(\d+)}}/g,
          (match, p1) => descriptionVariables.get(Number(p1)) ?? ""
        );
        return description;
      });
  }
  protected generateFeatureInfoTemplate(
    node: Node<Token>,
    logger: Logger
  ): Deferred<TerriaFeatureInfoTemplate | null> {
    const name = node.token.featureInfoTemplateName;
    const includePatterns = node.token.featureInfoTemplateInclude;
    const excludePatterns = node.token.featureInfoTemplateExclude;
    if (!name) return new Deferred((resolve) => resolve(null));
    return this.backend.getFeatureInfoTemplate(logger, name).then((matrix) => {
      const { rows, keys } = resolveMatrix(matrix);
      if (!keys.includes("name")) {
        logger.error(`属性テンプレート ${name} に "name" 列がありません。`);
        return null;
      }
      if (!keys.includes("property")) {
        logger.error(`属性テンプレート ${name} に "property" 列がありません。`);
        return null;
      }
      const innerHtml = rows
        .filter((row) => {
          if (isMatch(row.get("property") as string, excludePatterns))
            return false;
          if (isMatch(row.get("property") as string, includePatterns))
            return true;
          return row.get("default") !== "exclude";
        })
        .map(
          (row) =>
            `<tr><td>${row.get("name")}</td><td>{{${row.get(
              "property"
            )}}}</td></tr>`
        )
        .join("");
      const template = `<table>${innerHtml}</table>`;
      return { template };
    });
  }
  protected buildGroupOrComposite(
    node: Node<Token>,
    id: string,
    logger: Logger
  ): Deferred<TerriaCompositeOrGroup> {
    const deferredMembers = Deferred.all(
      node.children.map((childNode) =>
        this.build(childNode, id, logger.spawn(childNode.token.name))
      )
    );
    const deferredDescription = this.generateDescription(node, logger);
    return Deferred.all([deferredMembers, deferredDescription]).then(
      ([members, description]) => {
        const group: Partial<TerriaCompositeOrGroup> = {};
        group.id = id;
        group.name = node.token.name;
        group.type = node.token.type as "group" | "composite";
        if (description != null) group.description = description;
        group.members = members;
        return group as TerriaCompositeOrGroup;
      }
    );
  }
  protected buildItem(
    node: Node<Token>,
    id: string,
    logger: Logger
  ): Deferred<TerriaCatalogItem> {
    return Deferred.all([
      this.generateDescription(node, logger),
      this.generateFeatureInfoTemplate(node, logger),
    ]).then(([description, featureInfoTemplate]) => {
      const item: Partial<TerriaCatalogItem> = {};
      item.id = id;
      item.name = node.token.name;
      item.type = node.token.type;
      if (node.token.url) {
        item.url = node.token.url;
        item.hideSource = true;
      }
      if (description != null) item.description = description;
      if (featureInfoTemplate) item.featureInfoTemplate = featureInfoTemplate;
      if (node.children.length) {
        item.customProperties = {
          switchableUrls: node.children.map((child) => ({
            url: child.token.url,
            label: child.token.name,
          })),
        };
      }
      return item as TerriaCatalogItem;
    });
  }
  buildPerType(
    node: Node<Token>,
    parentId: string,
    logger: Logger
  ): Deferred<TerriaCatalogItem> {
    const id = `${parentId}/${node.token.name}`;
    switch (node.token.type) {
      case "group":
      case "composite":
        return this.buildGroupOrComposite(node, id, logger);
      default:
        return this.buildItem(node, id, logger);
    }
  }
  build(
    node: Node<Token>,
    parentId: string,
    logger: Logger
  ): Deferred<TerriaCatalogItem> {
    const decorateWithLogs = makeDecorateWithLogs(logger);
    return this.buildWithPlugins(node, parentId, logger).then(decorateWithLogs);
  }
}

const logEmojis = {
  info: "ℹ️",
  warn: "⚠️",
  error: "❌",
};

const logRanks = ["info", "warn", "error"] as const;

const MAX_LOGS = 3;

const makeDecorateWithLogs = (logger: Logger) => (item: TerriaCatalogItem) => {
  const logs = logger.getLogs();
  if (!logs.length) return item;
  const message = logs
    .slice(0, MAX_LOGS)
    .map((logData) => {
      const emoji = logEmojis[logData.level];
      const path = logData.path.join("/");
      return `- ${emoji} ${path}: ${logData.message}`;
    })
    .join("\n");
  const extraMessage =
    logs.length > MAX_LOGS ? `\n\nほか ${logs.length - MAX_LOGS} 件\n` : "";
  const originalDescription = item.description || "";
  const maxLogLevel =
    logRanks[
      Math.max(...logs.map((logData) => logRanks.indexOf(logData.level)))
    ];
  const originalName = item.name || "";
  return {
    ...item,
    name: `${logEmojis[maxLogLevel]}${originalName}`,
    description: `${message}${extraMessage}\n\n${originalDescription}`,
  };
};
