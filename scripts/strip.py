from io import StringIO
from html.parser import HTMLParser

# Used for early testing, to create plain/subtitles text files for aeneas
# Ultimately did not work as well as segmenting unparsed html code
# Keeping this code for now if needed later for further testing

class MLStripper(HTMLParser):
    def __init__(self):
        super().__init__()
        self.reset()
        self.strict = False
        self.convert_charrefs= True
        self.text = StringIO()
    def handle_data(self, d):
        self.text.write(d)
    def get_data(self):
        return self.text.getvalue()

def strip_tags(html):
    s = MLStripper()
    s.feed(html)
    return s.get_data()

# with open("./27919.html", "r", encoding="utf8") as f:
#     html = f.read()
#     stripped = strip_tags(html)

# with open("./bookplain.txt", "w", encoding="utf8") as f:
#     f.write(stripped)