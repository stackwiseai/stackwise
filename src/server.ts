import * as path from "path";
import {
  createConnection,
  ProposedFeatures,
  TextDocuments,
  TextDocument,
  Diagnostic,
  DiagnosticSeverity,
  InitializeParams,
  DidChangeConfigurationNotification,
  CompletionItem,
  CompletionItemKind,
  TextDocumentPositionParams,
  TextDocumentSyncKind,
  InitializeResult,
  WorkspaceFolder,
} from "vscode-languageserver/node";
// import { TextDocumentIdentifier } from 'vscode-languageserver-textdocument';
import { URI } from "vscode-uri";

// Create a connection for the server. The connection uses Node's IPC as a transport.
// Also include all preview / proposed LSP features.
let connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager. The text document manager
// supports full document sync only
// let documents: TextDocuments = new TextDocuments();

// Make the text document manager listen on the connection
// for open, change and close text document events
// documents.listen(connection);

// After the server has started the client sends an initialize request. The server receives
// in the passed params the rootPath of the workspace plus the client capabilities.
let workspaceRoot: URI;
connection.onInitialize((params: InitializeParams) => {
  workspaceRoot = URI.parse(params.rootPath || "");
  return {
    capabilities: {
      // Tell the client that the server works in FULL text document sync mode
      textDocumentSync: TextDocumentSyncKind.Full,
      // Tell the client that the server support code complete
      completionProvider: {
        resolveProvider: true,
      },
    },
  };
});

// The settings have changed. Is send on server activation as well.
connection.onDidChangeConfiguration((change) => {
  // Reconfigure your feature here
});

// The settings have changed. Is send on server activation as well.
connection.onDidChangeConfiguration((change) => {
  // Reconfigure your feature here
});

// This handler provides the initial list of the completion items.
connection.onCompletion(
  (textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
    // The pass parameter contains the position of the text document in
    // which code complete got requested. For the example we ignore this
    // info and always provide the same completion items.
    return [
      {
        label: "TypeScript",
        kind: CompletionItemKind.Text,
        data: 1,
      },
      {
        label: "JavaScript",
        kind: CompletionItemKind.Text,
        data: 2,
      },
    ];
  }
);

// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
  if (item.data === 1) {
    item.detail = "TypeScript details";
    item.documentation = "TypeScript documentation";
  } else if (item.data === 2) {
    item.detail = "JavaScript details";
    item.documentation = "JavaScript documentation";
  }
  return item;
});

// Listen on the connection
connection.listen();
