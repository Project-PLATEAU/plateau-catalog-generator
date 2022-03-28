import jsep from "jsep";
import Logger from "../../core/Logger";

const handleNode = (node: any) => {
  const maybeHandler = handler[node.type as jsep.ExpressionType];
  if (maybeHandler) return maybeHandler(node);
  throw new Error(`Unkown node type: ${node.type}.`);
};

// A subset of json-serializeable types.
export type MvtFilter = string | number | boolean | null | MvtFilter[];

const handler: { [key in jsep.ExpressionType]?: (node: any) => MvtFilter } = {
  BinaryExpression: (node: jsep.BinaryExpression) => {
    return [node.operator, handleNode(node.left), handleNode(node.right)];
  },
  Literal: (node: jsep.Literal) => {
    if (typeof node.value === "object") {
      throw new Error(`Cannot handle ${node.value}`);
    }
    return node.value;
  },
  Identifier: (node: jsep.Identifier) => {
    return node.name;
  },
  CallExpression: (node: jsep.CallExpression) => {
    return [handleNode(node.callee), ...node.arguments.map(handleNode)];
  },
};

const compileFilterExpression = (logger: Logger, text: string): MvtFilter => {
  try {
    return handleNode(jsep(text));
  } catch (e) {
    logger.error(
      `MVTのフィルター式 ${text} をパーズできませんでした。${
        (e as Error)?.message
      }`
    );
    return null;
  }
};

export default compileFilterExpression;
