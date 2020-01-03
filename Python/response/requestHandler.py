class MockFile():
    def read(self):
        return False

# RequestHandler class will take care of a requests.
# There are few classess extend base RequestHandler.
# by adding a new handler, there is no need to change serve.py file

class RequestHandler():
    def __init__(self):
        self.contentType = ""
        self.contents = MockFile()

    def getContents(self):
        # return self.contents
        try:
            return self.contents.read()
        # in response is not a file but just string
        except:
            return self.contents

    def read(self):
        return self.contents

    def setStatus(self, status):
        self.status = status

    def getStatus(self):
        return self.status

    def getContentType(self):
        return self.contentType

    def getType(self):
        return "static"
