import Logger from "../../core/Logger";
import compileFilterExpression from "./compileFilterExpression";

describe("compileFilterExpression", () => {
  test.each`
    input                         | output
    ${"1 + 2"}                    | ${["+", 1, 2]}
    ${'"class" == 203'}           | ${["==", "class", 203]}
    ${"class == 203"}             | ${["==", "class", 203]}
    ${"in(class, 201, 202, 203)"} | ${["in", "class", 201, 202, 203]}
  `(
    "compileFilterExpression(\"$input\") === '$output'",
    ({ input, output }) => {
      const logger = new Logger();
      expect(logger.getLogs()).toHaveLength(0);
      expect(compileFilterExpression(logger, input)).toEqual(output);
    }
  );
  test("error", () => {
    const logger = new Logger();
    expect(compileFilterExpression(logger, "class ==== 203")).toBe(null);
    expect(logger.getLogs()).toMatchInlineSnapshot(`
      Array [
        Object {
          "level": "error",
          "message": "MVTのフィルター式 class ==== 203 をパーズできませんでした。Expected expression after === at character 9",
          "path": Array [],
        },
      ]
    `);
  });
});
