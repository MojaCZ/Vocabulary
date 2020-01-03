import time
from http.server import HTTPServer
from server import Server

HOST = ''
PORT = 8081

httpd = HTTPServer((HOST, PORT), Server)
print(time.asctime(), 'Server Starts—%s:%s' % (HOST,PORT))

try:
    httpd.serve_forever()
except KeyboardInterrupt:
    pass
httpd.server_close()
print(time.asctime(), 'Server Stops—%s:%s' % (HOST, PORT))
