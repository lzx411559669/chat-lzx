import * as vscode from 'vscode';
import * as path from 'path';

// 激活插件时调用的函数
export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "chat-extension" is now active!');

    // 注册命令：显示聊天面板
    let disposable = vscode.commands.registerCommand('extension.showChatPanel', () => {
        // 创建或显示聊天面板
        ChatPanel.createOrShow(context.extensionUri);
    });

    context.subscriptions.push(disposable);
}

// 停用插件时调用的函数
export function deactivate() {}

// 聊天面板类
class ChatPanel {
    // 面板的唯一标识符
    public static readonly viewType = 'chatPanel';

    // VS Code Webview 面板对象
    private static panel: vscode.WebviewPanel | undefined;

    // 创建或显示面板方法
    public static createOrShow(extensionUri: vscode.Uri) {
        // 如果已经存在面板，显示现有面板
        if (ChatPanel.panel) {
            ChatPanel.panel.reveal(vscode.ViewColumn.Two);
            return;
        }

        // 创建新的 Webview 面板
        ChatPanel.panel = vscode.window.createWebviewPanel(
            ChatPanel.viewType, // 面板类型
            'Chat', // 面板标题
            vscode.ViewColumn.Two, // 显示位置：第二列
            {
                enableScripts: true, // 启用 JavaScript
            }
        );

        // 设置 Webview 的 HTML 内容
        ChatPanel.panel.webview.html = ChatPanel.getWebviewContent(extensionUri);

        // 当面板关闭时清空引用
        ChatPanel.panel.onDidDispose(() => {
            ChatPanel.panel = undefined;
        });
    }

    // 获取 Webview 的 HTML 内容
    private static getWebviewContent(extensionUri: vscode.Uri): string {
        // 获取静态资源路径
        const scriptUri = vscode.Uri.joinPath(extensionUri, 'resources', 'main.js');

        // 返回 HTML 内容
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Chat</title>
            </head>
            <body>
                <h1>Welcome to Chat</h1>
                <div id="messages"></div>
                <input type="text" id="messageInput">
                <button onclick="sendMessage()">Send</button>
                <script src="${ChatPanel.panel?.webview.asWebviewUri(scriptUri)}"></script>
            </body>
            </html>
        `;
    }
}
