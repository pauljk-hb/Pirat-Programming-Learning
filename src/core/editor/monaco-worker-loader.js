export function getMonacoWorkerUrl(label) {
  switch (label) {
    case "json":
      return new URL(
        "monaco-editor/esm/vs/language/json/json.worker.js",
        import.meta.url
      ).toString();
    case "css":
      return new URL(
        "monaco-editor/esm/vs/language/css/css.worker.js",
        import.meta.url
      ).toString();
    case "html":
      return new URL(
        "monaco-editor/esm/vs/language/html/html.worker.js",
        import.meta.url
      ).toString();
    case "typescript":
    case "javascript":
      return new URL(
        "monaco-editor/esm/vs/language/typescript/ts.worker.js",
        import.meta.url
      ).toString();
    default:
      return new URL(
        "monaco-editor/esm/vs/editor/editor.worker.js",
        import.meta.url
      ).toString();
  }
}
