import * as acorn from "acorn";
import * as walk from "acorn-walk";

export function transformUserCode(code) {
  const ast = acorn.parse(code, { ecmaVersion: 2020 });

  const modifications = [];

  walk.simple(ast, {
    CallExpression(node) {
      if (node.type !== "AwaitExpression") {
        modifications.push({ type: "await", start: node.start });
      }
    },
    FunctionDeclaration(node) {
      if (!node.async) {
        modifications.push({ type: "async", start: node.start });
      }
    },
    WhileStatement(node) {
      if (
        node.test.type === "CallExpression" &&
        node.test.callee.type !== "AwaitExpression"
      ) {
        modifications.push({ type: "await", start: node.test.start });
      }
    },
    IfStatement(node) {
      if (
        node.test.type === "CallExpression" &&
        node.test.type !== "AwaitExpression"
      ) {
        modifications.push({ type: "await", start: node.test.start });
      }
    },
  });

  const filteredModifications = modifications.filter(
    (mod, index, self) =>
      index ===
      self.findIndex((m) => m.type === mod.type && m.start === mod.start)
  );
  let transformedCode = code;

  filteredModifications
    .sort((a, b) => b.start - a.start) // Änderungen rückwärts anwenden
    .forEach((mod) => {
      if (mod.type === "await") {
        // Prüfen, ob bereits ein `await` davor steht
        const before = transformedCode.slice(0, mod.start).trimEnd();
        if (!before.endsWith("await")) {
          transformedCode =
            transformedCode.slice(0, mod.start) +
            "await " +
            transformedCode.slice(mod.start);
        }
      } else if (mod.type === "async") {
        transformedCode =
          transformedCode.slice(0, mod.start) +
          "async " +
          transformedCode.slice(mod.start);
      }
    });

  const finalCode = `
    async function runUserCode() {
      ${transformedCode}
    }
    runUserCode();
  `;

  console.log("Final Code:", finalCode);
  return finalCode;
}
