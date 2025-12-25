import http.server
import socketserver
import urllib.request
import urllib.error
import sys
import os

# 配置
PORT = 8001
TARGET_URL = "https://api.deepseek.com/chat/completions"

class ProxyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        # 拦截发往 /chat/completions 的请求
        if self.path.endswith('/chat/completions'):
            try:
                content_length = int(self.headers.get('Content-Length', 0))
                post_data = self.rfile.read(content_length)
                
                # 构造转发给 DeepSeek 的请求
                headers = {
                    'Content-Type': 'application/json',
                    'Authorization': self.headers.get('Authorization', '')
                }
                
                req = urllib.request.Request(TARGET_URL, data=post_data, headers=headers, method='POST')
                
                # 发送请求并获取响应
                with urllib.request.urlopen(req) as response:
                    self.send_response(response.status)
                    # 转发必要的响应头
                    self.send_header('Content-Type', response.headers.get('Content-Type', 'application/json'))
                    self.end_headers()
                    self.wfile.write(response.read())
                    
            except urllib.error.HTTPError as e:
                self.send_response(e.code)
                self.end_headers()
                self.wfile.write(e.read())
            except Exception as e:
                print(f"Proxy Error: {e}")
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode())
        else:
            # 其他 POST 请求返回 404
            self.send_error(404)

    def do_GET(self):
        # 普通文件请求由 SimpleHTTPRequestHandler 处理
        super().do_GET()

if __name__ == "__main__":
    # 切换到脚本所在目录，确保能正确服务 index.html
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    print(f"Mood Diary Server running at http://localhost:{PORT}")
    print(f"API Proxy active: /chat/completions -> {TARGET_URL}")
    
    # 允许地址重用，避免重启时报错
    socketserver.TCPServer.allow_reuse_address = True
    
    with socketserver.TCPServer(("", PORT), ProxyHTTPRequestHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")