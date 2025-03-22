import * as acorn from "acorn";
import * as walk from "acorn-walk";

export function transformUserCode(code) {
  const ast = acorn.parse(code, { ecmaVersion: 2020 });

  const modifications = [];

  // AST durchlaufen und relevante Knoten finden
  walk.simple(ast, {
    CallExpression(node) {
      // Funktionsaufrufe wie `move()`, `turnLeft()`, etc. um `await` erweitern
      if (
        ["move", "turnLeft", "turnRight", "noWater", "vor", "links"].includes(
          node.callee.name
        )
      ) {
        // Prüfen, ob bereits ein `await` vorhanden ist
        if (node.type !== "AwaitExpression") {
          modifications.push({ type: "await", start: node.start });
        }
      }
    },
    WhileStatement(node) {
      // Verzögerung am Ende des Schleifenblocks hinzufügen
      if (node.body.type === "BlockStatement") {
        modifications.push({ type: "delay", insertAfter: node.body.end });
      }
    },
    ForStatement(node) {
      // Verzögerung am Ende von Schleifenblöcken hinzufügen
      if (node.body.type === "BlockStatement") {
        modifications.push({ type: "delay", insertAfter: node.body.end });
      }
    },
  });

  // Änderungen rückwärts anwenden, um keine Offsets zu verschieben
  let transformedCode = code;
  modifications.reverse().forEach((mod) => {
    if (mod.type === "await") {
      // Prüfen, ob bereits ein `await` vorhanden ist
      const before = transformedCode.slice(0, mod.start).trimEnd();
      if (!before.endsWith("await")) {
        transformedCode =
          transformedCode.slice(0, mod.start) +
          "await " +
          transformedCode.slice(mod.start);
      }
    } else if (mod.type === "delay") {
      // `await delay();` nach Schleifenblock einfügen
      transformedCode =
        transformedCode.slice(0, mod.insertAfter) +
        "\n  await delay();" +
        transformedCode.slice(mod.insertAfter);
    }
  });

  // Transformierten Code in eine async-Funktion einbetten
  const finalCode = `
    async function runUserCode() {
      ${transformedCode}
    }
    runUserCode();
  `;

  console.log(finalCode);
  return finalCode;
}
