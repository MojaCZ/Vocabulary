import os
import xml.etree.ElementTree as ET

from http.server import BaseHTTPRequestHandler
from routes.main import routes
from response.templateHandler import TemplateHandler
from response.badRequestHandler import BadRequestHandler
from response.staticHandler_1 import StaticHandler
from response.postHandler import PostHandler
import urllib

# newWords(XML) will take XML, check it, create new file, save words into this file and return this file
def newWords(XML):
    newFileName = ""
    # root = ET.fromstring(treeXML)
    # print("ROOT TAG: ", root.tag)
    # for IDENT in root.iter('objekt'):
    #     print("objekt: ", IDENT.text)
    # print("\n\n\n")
    return newFileName

# created subclass will be subclass of BaseHTTPRequestHandler from the http.server package
# when a request comes in, the BaseHTTPRequestHandler will automatically route the request to the appropriate request method (go_GET, do_HEAD or do_POST)
class Server(BaseHTTPRequestHandler):
    def do_HEAD(self):
        return

    # getContent(self) reads header, get body and return dictionary of variables from body
    def getContent(self):
        content = {}
        content_length = int(self.headers['Content-Length'])
        body = self.rfile.read(content_length)
        body = urllib.parse.unquote(body.decode("utf-8"))
        body = body.split('&')
        for i in range(len(body)):
            var = body[i].split("=", 1)
            content[var[0]] = var[1]
        return content

    def do_POST(self):
        content_type = self.headers['content-type']
        content_length = int(self.headers['content-length'])
        if content_type == 'text/xml':

            # READ REQUEST WITH NEW WORDS XML
            content = self.getContent()
            wordsXML = content["wordsXML"]

            # RESPOND BACK
            content = "ALL DONE"     #>>>>>>>>>>>>>>>>>>> here will be a string containing number of new file so server could set this file
            handler = PostHandler()
            handler.find(content)
            # HERE NEEDS TO BE DONE PROPER HANDLE OF RESPONSE!!!

        else:
            handler = BadRequestHandler()

        self.respond({
            "handler": handler
        })

    # do_GET will be handling request with RequestHandler objects
    def do_GET(self):
        # split path into parts
        split_path = os.path.splitext(self.path)
        request_extension = split_path[1]

        # http files
        # URL requests ("/", "/helloWorld") and "*.html" files goes from here
        if request_extension is "" or request_extension is ".html":
            if self.path in routes:
                handler = TemplateHandler()
                handler.find(routes[self.path])
            else:
                handler = BadRequestHandler()

        # I dont want to serve .py files
        elif request_extension is ".py":
            handler = BadRequestHandler()

        # static files
        else:
            handler = StaticHandler()
            handler.find(self.path)

        # send the created handler through to the response
        self.respond({
            "handler": handler
        })

    # send basic http handlers and return the content
    def handle_http(self, handler):
        status_code = handler.getStatus()

        self.send_response(status_code)
        # if handler was able to find the file
        if status_code is 200:

            # get content from handler
            content = handler.getContents()

            # send header with content type
            self.send_header("Content-type", handler.getContentType())
        else:
            content = "404 Not Found"

        # end headers
        self.end_headers()

        # check if files to send are already a bytes or bytearray types
        if isinstance( content, (bytes, bytearray) ):
            return content

        return bytes(content, "UTF-8")


    # respond will be sending response
    def respond(self, opts):
        response = self.handle_http(opts["handler"])
        # send the finalized content out
        self.wfile.write(response)
