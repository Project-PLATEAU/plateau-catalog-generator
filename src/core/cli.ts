import Preset from "./Preset";
import NodeFileBackend from "./NodeFileBackend";
import { program } from "commander";
import { writeFile } from "fs/promises";

program
  .showHelpAfterError()
  .name("plateau-catalog-generator")
  .description("Plateau View 用カタログファイルジェネレーター。")
  .argument("<source>", "catalog.csv が置いてあるディレクトリへのパス。")
  .argument("<destination>", "生成するカタログファイルへのパス。")
  .option(
    "--rootName <name>",
    "カタログの生成範囲を絞り込む際に使用します。このオプションが指定された場合、指定された名前のグループのみがカタログに出力されます。省略した場合は全てのデータセットがカタログに出力されます。"
  )
  .helpOption("-h, --help", "ヘルプ (今表示されているもの) を表示します。")
  .action(
    async (
      source: string,
      destination: string,
      options: { rootName: string }
    ) => {
      const app = new Preset(new NodeFileBackend(source));
      await app
        .buildTerriaInitDocument({ rootName: options.rootName })
        .then((document) =>
          writeFile(destination, JSON.stringify(document, null, 2))
        );
    }
  )
  .parse();
