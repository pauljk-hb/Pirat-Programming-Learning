import * as acorn from "acorn";
import * as walk from "acorn-walk";

let commandQueue = [];
let isExecuting = false;

function processQueue() {
  if (commandQueue.length === 0) {
    isExecuting = false;
    return;
  }

  isExecuting = true;
  const command = commandQueue.shift(); // Nimm den ersten Befehl aus der Warteschlange

  // Führe den Befehl aus und warte 500ms, bevor der nächste ausgeführt wird
  setTimeout(() => {
    command(); // Führe den aktuellen Befehl aus
    processQueue(); // Verarbeite den nächsten Befehl
  }, 500);
}

function queueCommand(command) {
  commandQueue.push(command); // Füge den Befehl zur Warteschlange hinzu
  if (!isExecuting) {
    processQueue(); // Starte die Verarbeitung, wenn sie nicht läuft
  }
}

// Mach queueCommand global verfügbar
window.queueCommand = queueCommand;

export function parsedCode(code) {
  const ast = acorn.parse(code, { ecmaVersion: 2020 });
  let transformedCode = code;

  walk.simple(ast, {
    ForStatement(node) {
      const init = code.slice(node.init.start, node.init.end);
      const test = code.slice(node.test.start, node.test.end);
      const update = code.slice(node.update.start, node.update.end);
      const body = code.slice(node.body.start, node.body.end);

      const newCode = `
        ${init};
        function loopIteration() {
          if (${test}) {
            ${body}
            ${update};
            setTimeout(loopIteration, 500);
          }
        }
        loopIteration();
      `;

      transformedCode = transformedCode.replace(
        code.slice(node.start, node.end),
        newCode
      );
    },
    WhileStatement(node) {
      const test = code.slice(node.test.start, node.test.end);
      const body = code.slice(node.body.start, node.body.end);

      const newCode = `
        function loopWhile() {
          if (${test}) {
            ${body}
            setTimeout(loopWhile, 500);
          }
        }
        loopWhile();
      `;

      transformedCode = transformedCode.replace(
        code.slice(node.start, node.end),
        newCode
      );
    },
    ExpressionStatement(node) {
      if (node.expression.type === "CallExpression") {
        const callExpressionCode = code.slice(node.start, node.end);

        // Wrap the function call with queueCommand
        const wrappedCode = `
          queueCommand(() => {
            ${callExpressionCode}
          });
        `;

        transformedCode = transformedCode.replace(
          code.slice(node.start, node.end),
          wrappedCode
        );
      }
    },
  });

  return transformedCode;
}
