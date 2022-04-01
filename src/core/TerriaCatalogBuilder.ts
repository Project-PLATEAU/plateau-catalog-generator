import Deferred from "./Deferred";
import Logger from "./Logger";
import { Token } from "./tokenize";
import { Node } from "./TreeBuilder";
import { TerriaCatalogItem, TerriaCompositeOrGroup } from "./types";

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
  constructor(private plugins: Plugin[] = []) {
    this.buildWithPlugins = this.plugins.reduce(
      (acc, cur) => cur(acc),
      this.buildPerType.bind(this)
    );
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
    return Deferred.all([deferredMembers]).then(([members]) => {
      const group: Partial<TerriaCompositeOrGroup> = {};
      group.id = id;
      group.name = node.token.name;
      group.type = node.token.type as "group" | "composite";
      group.members = members;
      return group as TerriaCompositeOrGroup;
    });
  }
  protected buildItem(
    node: Node<Token>,
    id: string
  ): Deferred<TerriaCatalogItem> {
    return new Deferred((resolve) => {
      const item: Partial<TerriaCatalogItem> = {};
      item.id = id;
      item.name = node.token.name;
      item.type = node.token.type;
      if (node.token.url) {
        item.url = node.token.url;
        item.hideSource = true;
      }
      if (node.children.length) {
        item.customProperties = {
          switchableUrls: node.children.map((child) => ({
            url: child.token.url,
            label: child.token.name,
          })),
        };
      }
      resolve(item as TerriaCatalogItem);
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
        return this.buildItem(node, id);
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
