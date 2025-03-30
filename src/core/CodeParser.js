import * as acorn from "acorn";
import * as walk from "acorn-walk";

export class CodeParser {
  constructor(ecmaVersion = 2020) {
    this.ecmaVersion = ecmaVersion; // ECMAScript-Version für den Parser
  }

  /**
   * Transformiert den Benutzer-Code, indem `async` und `await` hinzugefügt werden.
   * @param {string} code - Der Benutzer-Code.
   * @returns {string|null} - Der transformierte Code oder `null`, wenn ein Fehler auftritt.
   */
  transformUserCode(code) {
    let ast;
    try {
      ast = acorn.parse(code, { ecmaVersion: this.ecmaVersion });
    } catch (error) {
      console.error("Syntaxfehler im Code:", error.message);
      return null;
    }

    const modifications = this.collectModifications(ast);

    // Filtere und sortiere die Modifikationen
    const filteredModifications =
      this.filterAndSortModifications(modifications);

    // Wende die Modifikationen auf den Code an
    const transformedCode = this.applyModifications(
      code,
      filteredModifications
    );

    // Verpacke den transformierten Code in eine async-Funktion
    return `
      async function userCode() {
        ${transformedCode}
      }
      userCode();
    `;
  }

  /**
   * Sammelt die notwendigen Modifikationen (`async` und `await`) aus dem AST.
   * @param {object} ast - Der Abstract Syntax Tree (AST) des Codes.
   * @returns {Array} - Eine Liste von Modifikationen.
   */
  collectModifications(ast) {
    const modifications = [];

    walk.simple(ast, {
      CallExpression: (node) => {
        if (node.type !== "AwaitExpression") {
          modifications.push({ type: "await", start: node.start });
        }
      },
      FunctionDeclaration: (node) => {
        if (!node.async) {
          modifications.push({ type: "async", start: node.start });
        }
      },
      WhileStatement: (node) => {
        if (
          node.test.type === "CallExpression" &&
          node.test.callee.type !== "AwaitExpression"
        ) {
          modifications.push({ type: "await", start: node.test.start });
        }
      },
      IfStatement: (node) => {
        if (
          node.test.type === "CallExpression" &&
          node.test.type !== "AwaitExpression"
        ) {
          modifications.push({ type: "await", start: node.test.start });
        }
      },
    });

    return modifications;
  }

  /**
   * Filtert und sortiert die Modifikationen, um Duplikate zu entfernen und die Reihenfolge zu korrigieren.
   * @param {Array} modifications - Die Liste der Modifikationen.
   * @returns {Array} - Die gefilterten und sortierten Modifikationen.
   */
  filterAndSortModifications(modifications) {
    return modifications
      .filter(
        (mod, index, self) =>
          index ===
          self.findIndex((m) => m.type === mod.type && m.start === mod.start)
      )
      .sort((a, b) => b.start - a.start); // Änderungen rückwärts anwenden
  }

  /**
   * Wendet die Modifikationen auf den Benutzer-Code an.
   * @param {string} code - Der ursprüngliche Benutzer-Code.
   * @param {Array} modifications - Die Liste der Modifikationen.
   * @returns {string} - Der transformierte Code.
   */
  applyModifications(code, modifications) {
    let transformedCode = code;

    modifications.forEach((mod) => {
      if (mod.type === "await") {
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

    return transformedCode;
  }
}
