import Preset from "./preset/Preset";
import PresetNodeJsBackend from "./preset/PresetNodeJsBackend";
import { Option, program } from "commander";
import { writeFile } from "fs/promises";
import prettifyTerriaCatalog from "./core/prettifyTerriaCatalog";

program
  .showHelpAfterError()
  .name("plateau-catalog-generator")
  .description(
    "CSV 形式で定義したカタログの情報から、PLATEAU VIEW で使用可能なカタログファイルを生成するコマンドラインツールです。"
  )
  .argument("<source>", "catalog.csv が置いてあるディレクトリへのパス。")
  .argument("<destination>", "生成するカタログファイルへのパス。")
  .addOption(
    Object.assign(
      new Option(
        "--rootName <name>",
        "カタログの生成範囲を絞り込む際に使用します。このオプションが指定された場合、指定された名前のグループのみがカタログに出力されます。省略した場合は全てのデータセットがカタログに出力されます。"
      ),
      { hidden: true }
    )
  )
  .helpOption("-h, --help", "ヘルプ (今表示されているもの) を表示します。")
  .action(
    async (
      source: string,
      destination: string,
      options: { rootName: string }
    ) => {
      const app = new Preset(new PresetNodeJsBackend(source));
      await app
        .buildTerriaInitDocument({ rootName: options.rootName })
        .then((document) => {
          const stringified = JSON.stringify(
            prettifyTerriaCatalog(document),
            null,
            2
          );
          if (destination === "-") {
            // Stealth option to print the output to stdout.
            console.log(stringified);
          } else {
            writeFile(destination, stringified);
          }
        });
    }
  )
  .parse();
