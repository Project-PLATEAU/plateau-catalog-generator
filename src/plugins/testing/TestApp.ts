import { jest } from "@jest/globals";
import App from "../../core/App";
import Deferred from "../../core/Deferred";
import Logger from "../../core/Logger";
import NodeFileBackend from "../../preset/PresetNodeJsBackend";
import { Plugin } from "../../core/TerriaCatalogBuilder";

class TestApp {
  backend: NodeFileBackend;
  logger = new Logger();
  constructor(
    dir: string,
    public getPlugins: (backend: NodeFileBackend) => Plugin[]
  ) {
    this.backend = new NodeFileBackend(dir);
    this.backend.fetch = jest.fn(() => new Deferred((resolve) => resolve("")));
  }
  buildTerriaInitDocument() {
    return new App(this.logger, this.backend, {
      plugins: this.getPlugins(this.backend),
    }).buildTerriaInitDocument();
  }
}

export default TestApp;
