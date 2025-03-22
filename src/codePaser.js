import * as acorn from "acorn";
import * as walk from "acorn-walk";

export function transformUserCode(code) {
  const ast = acorn.parse(code, { ecmaVersion: 2020 });

  // Liste der Änderungen, die wir vornehmen wollen
  const modifications = [];

  // AST durchlaufen und relevante Knoten finden
  walk.simple(ast, {
    CallExpression(node) {
      // Funktionsaufrufe wie `moveForward()`, `turnLeft()` etc. um `await` erweitern
      if (
        ["moveForward", "turnLeft", "turnRight", "noWater"].includes(
          node.callee.name
        )
      ) {
        modifications.push({
          type: "await",
          start: node.start,
          end: node.end,
        });
      }
    },
    ForStatement(node) {
      // `await delay()` am Ende von Schleifen hinzufügen
      if (node.body.type === "BlockStatement") {
        modifications.push({
          type: "delay",
          insertAfter: node.body.end - 1,
        });
      }
    },
    WhileStatement(node) {
      // `await delay()` am Ende von While-Schleifen hinzufügen
      if (node.body.type === "BlockStatement") {
        modifications.push({
          type: "delay",
          insertAfter: node.body.end - 1,
        });
      }
    },
  });

  // Originalcode in ein Array von Zeichen umwandeln
  let transformedCode = code.split("");

  // Änderungen rückwärts anwenden, um die Positionen nicht zu verschieben
  modifications.reverse().forEach((mod) => {
    if (mod.type === "await") {
      // `await` vor Funktionsaufruf einfügen
      transformedCode.splice(mod.start, 0, "await ");
    } else if (mod.type === "delay") {
      // `await delay();` nach Schleifenblock einfügen
      transformedCode.splice(mod.insertAfter + 1, 0, "\n  await delay();");
    }
  });

  // Transformierten Code zusammenfügen und in eine async-Funktion einbetten
  const finalCode = `
    async function runUserCode() {
      ${transformedCode.join("")}
    }
    runUserCode();
  `;

  console.log(finalCode);
  return finalCode;
}
