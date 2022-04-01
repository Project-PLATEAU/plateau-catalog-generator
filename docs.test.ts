import childProcess from "child_process";
import { readFile } from "fs/promises";
import packageJson from "./package.json";

const exec = async (cmd: string) =>
  new Promise<string>((resolve) => {
    childProcess.exec(cmd, (err, stdout, stderr) => {
      resolve(stdout || stderr);
    });
  });

test.each([
  ["1_basic"],
  ["2_more_types"],
  ["3_descriptions"],
  ["4_legends"],
  ["5_feature_info_templates"],
  ["6_options"],
  ["7_init"],
])("%s matches snapshot", async (dirName) => {
  // This performs snapshot testing against the generated catalog files.
  // Delete the output file and re-run the test to update snapshots.

  const sourcePath = `./docs/samples/${dirName}`;
  const snapshotPath = `${sourcePath}/terria.json`;
  const expected = await readFile(`${sourcePath}/terria.json`, {
    encoding: "utf8",
  }).catch(() => "");

  // If the snapshot exists, write to stdout for assertion.
  // Otherwise write the result to where the snapshot should be.
  const destinationPath = expected ? "-" : snapshotPath;
  const out = await exec(
    `node ${packageJson.bin} ${sourcePath} ${destinationPath}`
  );
  expect(out.trim()).toEqual(expected);
});
