class ChatApp {
    constructor() {
        this.messageContainer = document.getElementById('chat-messages');
        this.userInput = document.getElementById('user-input');
        this.sendButton = document.getElementById('send-btn');
        
        // 加载 marked 库用于 Markdown 渲染
        this.loadMarkedLibrary();
        this.init();
    }
    
    loadMarkedLibrary() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
        document.head.appendChild(script);
    }
    
    init() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }
    
    async sendMessage() {
        const message = this.userInput.value.trim();
        if (!message) return;
        
        this.addMessage(message, 'user');
        this.userInput.value = '';
        
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'message bot-message';
        // 添加加载动画
        botMessageDiv.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div>';
        this.messageContainer.appendChild(botMessageDiv);
        
        try {
            const response = await fetch('http://localhost:5000/api/chat/stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });
            
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';
            
            while (true) {
                const {value, done} = await reader.read();
                if (done) break;
                
                const text = decoder.decode(value);
                const lines = text.split('\n');
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.response) {
                                fullResponse = data.response;
                                // 使用 marked 渲染 Markdown
                                botMessageDiv.innerHTML = marked.parse(fullResponse);
                                this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
                            } else if (data.error) {
                                console.error('Server error:', data.error);
                                botMessageDiv.innerHTML = `<div class="error-message">错误: ${data.error}</div>`;
                            }
                        } catch (e) {
                            console.error('Parse error:', e);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Network error:', error);
            botMessageDiv.innerHTML = '<div class="error-message">抱歉，发生了网络错误，请稍后重试。</div>';
        }
    }
    
    addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.textContent = text;
        this.messageContainer.appendChild(messageDiv);
        this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
});
