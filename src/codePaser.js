import * as acorn from "acorn";
import * as astring from "astring";

// Verzögerungsfunktion
function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// AST transformieren: Pausen für alle Schleifen & Funktionsaufrufe einfügen
export function transformUserCode(code) {
  const ast = acorn.parse(code, { ecmaVersion: 2020 });

  function transformNode(node) {
    if (
      node.type === "ExpressionStatement" &&
      node.expression.type === "CallExpression"
    ) {
      // Funktionsaufrufe um `await` erweitern
      return {
        type: "BlockStatement",
        body: [
          {
            type: "ExpressionStatement",
            expression: {
              type: "AwaitExpression",
              argument: node.expression,
            },
          },
          {
            type: "ExpressionStatement",
            expression: {
              type: "AwaitExpression",
              argument: {
                type: "CallExpression",
                callee: { type: "Identifier", name: "delay" },
                arguments: [],
              },
            },
          },
        ],
      };
    } else if (
      node.type === "ForStatement" ||
      node.type === "WhileStatement" ||
      node.type === "DoWhileStatement" ||
      node.type === "ForInStatement" ||
      node.type === "ForOfStatement"
    ) {
      // Alle Schleifen um `await delay()` ergänzen
      return {
        ...node,
        body: {
          type: "BlockStatement",
          body: [
            ...(node.body.type === "BlockStatement"
              ? node.body.body.map(transformNode)
              : [transformNode(node.body)]),
            {
              type: "ExpressionStatement",
              expression: {
                type: "AwaitExpression",
                argument: {
                  type: "CallExpression",
                  callee: { type: "Identifier", name: "delay" },
                  arguments: [],
                },
              },
            },
          ],
        },
      };
    }
    return node;
  }

  // Transformiere alle Nodes im AST
  ast.body = ast.body.flatMap((node) => {
    const transformed = transformNode(node);
    return transformed.type === "BlockStatement"
      ? transformed.body
      : transformed;
  });

  return `async function runUserCode() {\n${astring.generate(
    ast
  )}\n}\nrunUserCode();`;
}
