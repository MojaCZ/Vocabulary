from response.requestHandler import RequestHandler

class PostHandler(RequestHandler):
    def __init__(self):
        super().__init__()
        self.contentType = "text/plain; charset=utf-8"

    # find specific file and set the contents
    def find(self, content):
        try:
            # template_file = open("templates/{}".format(routeData["template"]), encoding="utf8")
            self.contents = "response=" + content + "&"
            content = str.encode(content)
            self.setStatus(200)
            return True
        except:
            self.setStatus(404)
            return False
