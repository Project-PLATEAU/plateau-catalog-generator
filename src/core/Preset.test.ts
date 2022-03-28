import Preset from "./Preset";
import NodeFileBackend from "./NodeFileBackend";
import catalogSerializer from "./catalogSerializer";

expect.addSnapshotSerializer(catalogSerializer);

describe("Preset", () => {
  it("can build a terria catalog", async () => {
    const app = new Preset(new NodeFileBackend("./testdata/"));
    const catalog = await app.buildTerriaInitDocument();
    expect(catalog).toMatchSnapshot();
  });
});
