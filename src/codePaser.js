import * as acorn from "acorn";
import * as walk from "acorn-walk";

export function transformUserCode(code) {
  const ast = acorn.parse(code, { ecmaVersion: 2020 });

  const modifications = [];

  // AST durchlaufen und relevante Knoten finden
  walk.simple(ast, {
    CallExpression(node) {
      // Funktionsaufrufe um `await` erweitern
      if (
        [
          "move",
          "turnLeft",
          "turnRight",
          "noWater",
          "vor",
          "vorneFrei",
          "links",
        ].includes(node.callee.name)
      ) {
        modifications.push({ type: "await", start: node.start });
      }
    },
    IfStatement(node) {
      // `await` für asynchrone Funktionsaufrufe in `if`-Bedingungen
      if (
        node.test.type === "CallExpression" &&
        ["vorneFrei", "noWater"].includes(node.test.callee.name)
      ) {
        modifications.push({ type: "await", start: node.test.start });
      }
    },
    ForStatement(node) {
      // `await delay();` am Ende von Schleifenblöcken hinzufügen
      if (node.body.type === "BlockStatement") {
        modifications.push({ type: "delay", insertAfter: node.body.end });
      }
    },
    WhileStatement(node) {
      // `await delay();` am Ende von While-Schleifen hinzufügen
      if (node.body.type === "BlockStatement") {
        modifications.push({ type: "delay", insertAfter: node.body.end });
      }
    },
  });

  // Änderungen rückwärts anwenden, um keine Offsets zu verschieben
  let transformedCode = code;
  modifications.reverse().forEach((mod) => {
    if (mod.type === "await") {
      transformedCode =
        transformedCode.slice(0, mod.start) +
        "await " +
        transformedCode.slice(mod.start);
    } else if (mod.type === "delay") {
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
