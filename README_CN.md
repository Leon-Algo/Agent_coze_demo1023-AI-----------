# AI 新闻助手

一个基于 Coze API 的网络 AI 助手应用程序，提供交互式聊天功能。该项目由 Flask 后端和前端界面组成，实现与 AI 的无缝通信。

## 安装说明

1. 克隆仓库：
```bash
git clone [仓库地址]
cd Agent_coze_demo1023-AI快报功能正常无提示优化
```

2. 安装后端依赖：
```bash
cd backend
pip install flask flask-cors coze-python
```

3. 配置环境变量：
- `COZE_API_TOKEN`：您的 Coze API 令牌
- `COZE_BOT_ID`：您的 Coze Bot ID

## 使用说明

1. 启动后端服务器：
```bash
cd backend
python app.py
```

2. 访问应用程序：
- 打开网络浏览器并访问 `http://localhost:5000`
- 通过网页界面开始与 AI 助手对话

## 参与贡献

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m '添加一些特性'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 开源许可

本项目采用 MIT 许可证 - 查看 LICENSE 文件了解详情。
