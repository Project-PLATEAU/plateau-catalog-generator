import Backend from "./Backend";
import Deferred from "./Deferred";
import Logger from "./Logger";
import resolveMatrix from "./resolveMatrix";
import TerriaCatalogBuilder, { Plugin } from "./TerriaCatalogBuilder";
import tokenize, { Token } from "./tokenize";
import TreeBuilder from "./TreeBuilder";
import { TerriaCatalogItem, TerriaInit } from "./types";

interface AppConfig {
  filterPattern: string;
  plugins: Plugin[];
}

const defaultConfig: AppConfig = {
  filterPattern: "",
  plugins: [],
};

const rootToken: Token = {
  depth: -Infinity,
  name: "",
  tag: "*",
  type: "group",
  url: "",
  options: [],
  descriptionTemplateName: "",
  descriptionVariables: new Map(),
  featureInfoTemplateName: "",
  featureInfoTemplateInclude: [],
  featureInfoTemplateExclude: [],
  props: new Map(),
};

const limitTokens = (tokens: Token[], predicate: (token: Token) => boolean) => {
  let curIndex = tokens.findIndex(predicate);
  if (curIndex === -1) return [];
  const startDepth = tokens[curIndex].depth;
  const slicedTokens = [];
  do {
    // Collect the first token and its children
    slicedTokens.push(tokens[curIndex]);
    curIndex += 1;
  } while (tokens[curIndex] && tokens[curIndex].depth > startDepth);
  return slicedTokens;
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
          ...((rootIndex &&
            limitTokens(
              tokenize(resolvedMatrix),
              (token) => token.index === rootIndex
            )) ||
            (rootName &&
              limitTokens(
                tokenize(resolvedMatrix),
                (token) => token.name === rootName
              )) ||
            tokenize(resolvedMatrix)),
        ];
        const treeBuilder = new TreeBuilder(tokens);
        const tree = treeBuilder.processNode();
        const builder = new TerriaCatalogBuilder(this.backend, plugins);
        const catalog = builder.build(tree, "", this.logger);
        return catalog;
      }),
    ]).then(([init, catalog]) => {
      return { ...init, catalog: catalog.members as TerriaCatalogItem[] };
    });
  }
}
