import re
import os

encoding = '<?xml version="1.0" encoding="UTF-8"?>\n'

def segment(bookname="bok1"):
    # Takes in the file location and name of the book
    with open("././input/{}/{}.html".format(bookname, bookname), "r", encoding="utf8") as f:
        text = f.read()
    # Split the text at each header
    segments = re.split(r'<h1', text)

    # If segments and or a directory for the book does not exist create it
    if not os.path.exists("././input/{}/segments/".format(bookname)):
        os.makedirs("././input/{}/segments/".format(bookname))

    for i, segment in enumerate(segments[1:]):
        with open("././input/{}/segments/b{}.html".format(bookname, i + 1), "w", encoding="utf8") as f:
            # Write each segment into a seperate html file for later use
            f.write(encoding + '<h1' + segment)