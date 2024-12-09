from flask import Flask, request, jsonify, Response, stream_with_context, send_from_directory
from flask_cors import CORS
import os
from coze import Coze
import json

# 设置环境变量
os.environ['COZE_API_TOKEN'] = "pat_ecU2Pa3F0Vzr6TpTWXDclJEDzHCkj3BNlYUnCnel0G90aoqGqIrjLtAov4yv1WWm"
os.environ['COZE_BOT_ID'] = "7428058407762100234"

app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)

# 初始化Coze实例
coze_agent = Coze(stream=True)

# 添加根路由，服务前端页面
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

# 服务静态文件
@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory(os.path.join(app.static_folder, 'static'), path)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    
    try:
        # 使用Coze类进行对话
        response = coze_agent(user_message)
        return jsonify({'response': response})
        
    except Exception as e:
        error_message = f'发生错误: {str(e)}'
        print(error_message)
        return jsonify({'error': error_message}), 500

@app.route('/api/chat/stream', methods=['POST'])
def chat_stream():
    try:
        data = request.json
        if not data:
            raise ValueError("未收到请求数据")
        
        user_message = data.get('message')
        if not user_message:
            raise ValueError("消息内容为空")
        
        print(f"收到用户消息: {user_message}")  # 调试信息
        
        def generate():
            try:
                response = coze_agent.chat(user_message, stream=True)
                print(f"Coze响应: {response}")  # 调试信息
                yield f"data: {json.dumps({'response': response})}\n\n"
            except Exception as e:
                print(f"Coze错误: {str(e)}")  # 调试信息
                yield f"data: {json.dumps({'error': str(e)})}\n\n"
        
        return Response(stream_with_context(generate()), 
                       content_type='text/event-stream')
                       
    except Exception as e:
        print(f"API错误: {str(e)}")  # 调试信息
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("AI助手服务器启动成功！")
    print(f"使用的Bot ID: {os.environ['COZE_BOT_ID']}")
    print(f"API Token前10位: {os.environ['COZE_API_TOKEN'][:10]}...")
    print("请访问 http://127.0.0.1:5000 开始对话")
    app.run(debug=True)
