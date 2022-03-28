import { jest } from "@jest/globals";
import App from "../../core/App";
import Backend from "../../core/Backend";
import Deferred from "../../core/Deferred";
import Logger from "../../core/Logger";
import NodeFileBackend from "../../core/NodeFileBackend";
import { Plugin } from "../../core/TerriaCatalogBuilder";

class TestApp {
  backend: Backend;
  logger = new Logger();
  constructor(dir: string, public getPlugins: (backend: Backend) => Plugin[]) {
    this.backend = new NodeFileBackend(dir);
    this.backend.fetch = jest.fn(() => new Deferred((resolve) => resolve("")));
  }
  buildTerriaInitDocument() {
    return new App(this.logger, this.backend, {
      plugins: this.getPlugins(this.backend),
      filterPattern: "",
    }).buildTerriaInitDocument();
  }
}

export default TestApp;
