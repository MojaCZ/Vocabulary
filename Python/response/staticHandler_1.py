from response.requestHandler import RequestHandler
import os
import xml.etree.ElementTree as ET
# server.py will pass the entire path to a given request into the handler for that request
# I will serve only from public folder
#   1. No one can request files outside that folder
#   2. I can access te files from a simple path (as a root for my files): main.css -> public/main.css

# createXML is function that finds out which files are available for user
def createXML():
    XML = "<?xml version='1.0' encoding=\"UTF-8\"?>\n<files>\n"
    files = os.listdir("./public/vocabulary/")

    for file in files:
        tree = ET.parse("./public/vocabulary/" + file)
        vocabName = tree.getroot().find('name').text
        XML = XML + "\t<name>" + vocabName + "</name><id>" + file[:-4] + "</id>\n"

    XML = XML + "</files>"
    return XML

class StaticHandler(RequestHandler):
    def __init__(self):
        self.filetypes = {
            ".js" : "text/javascript; charset=utf-8",
            ".css" : "text/css; charset=utf-8",
            ".jpg" : "image/jpeg; charset=utf-8",
            ".png" : "image/png; charset=utf-8",
            ".xml" : "text/xml; charset=utf-8",
            "notfound" : "text/plain; charset=utf-8"
        }

    # find the file
    def find(self, file_path):
        split_path = os.path.splitext(file_path)
        extension = split_path[1]

        try:
            # images are already in bite format -> 'rb'
            if extension in (".jpg", ".jpeg", ".png"):
                self.contents = open("public{}".format(file_path), 'rb')
            else:
                # custom for vocabulary - if requested files, read files and send as XML
                if(split_path[0] == "/vocabulary/vocabularyFiles"):
                    self.contents = createXML()
                else:
                    self.contents = open("public{}".format(file_path), 'r', encoding="utf8")

            self.setContentType(extension)
            self.setStatus(200)
            return True

        except:
            self.setContentType("notfound")
            self.setStatus(404)
            return False

    # set appropriate content type depending on the file extension
    def setContentType(self, ext):
        self.contentType = self.filetypes[ext]
