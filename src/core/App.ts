import { isMatch } from "matcher";
import Backend from "./CoreBackend";
import Deferred from "./Deferred";
import Logger from "./Logger";
import resolveMatrix from "./resolveMatrix";
import searchTree from "./searchTree";
import TerriaCatalogBuilder, { Plugin } from "./TerriaCatalogBuilder";
import tokenize, { Token } from "./tokenize";
import TreeBuilder from "./TreeBuilder";
import { TerriaCatalogItem, TerriaInit } from "./types";

interface AppConfig {
  plugins: Plugin[];
}

const defaultConfig: AppConfig = {
  plugins: [],
};

const rootToken: Token = {
  depth: -Infinity,
  name: "",
  type: "group",
  url: "",
  props: new Map(),
};

/**
 * A façade for most of the submodules in this library.
 */
export default class App {
  constructor(
    private readonly logger: Logger,
    private readonly backend: Backend,
    private readonly config: AppConfig = defaultConfig
  ) {}
  buildTerriaInitDocument({
    rootIndex,
    rootId = "",
    rootName,
  }: {
    rootIndex?: number;
    rootId?: string;
    rootName?: string;
  } = {}): Deferred<TerriaInit> {
    const { plugins } = this.config;
    return Deferred.all([
      this.backend.getInit(this.logger),
      this.backend.getCatalogMatrix(this.logger).then((data) => {
        const resolvedMatrix = resolveMatrix(data);
        const tokens = [
          { ...rootToken, name: rootId },
          ...tokenize(resolvedMatrix),
        ];
        const treeBuilder = new TreeBuilder(tokens);
        let tree = treeBuilder.processNode();
        if (rootIndex != null) {
          tree = searchTree(tree, (node) => node.token.index === rootIndex);
        }
        if (rootName != null) {
          tree = searchTree(tree, (node) =>
            isMatch(node.token.name, rootName.split(","))
          );
        }
        const builder = new TerriaCatalogBuilder(plugins);
        const catalog = builder.build(tree, "", this.logger);
        return catalog;
      }),
    ]).then(([init, catalog]) => {
      return { ...init, catalog: catalog.members as TerriaCatalogItem[] };
    });
  }
}
