/**
 * 🔧 配置文件模板 (Config Template)
 * 
 * 使用说明：
 * 1. 复制此文件并重命名为 config.js
 * 2. 在下方填入你的 API Key
 * 3. config.js 已被加入 .gitignore，不会被提交到 Git 仓库，保护你的 Key 安全。
 */

const MOOD_DIARY_CONFIG = {
    // 1. 你的 API Key (必填)
    // 在双引号中粘贴你的 DeepSeek Key，例如: "sk-abcdefg..."
    apiKey: "", 

    // 2. API 地址
    // 如果使用本地 server.py 代理，请保持如下配置
    apiUrl: "/https://api.deepseek.com/chat/completions",
    
    // 3. 模型名称
    model: "deepseek-chat"
};
