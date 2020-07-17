import re
import os

# Encode each segment with xml so that icelandic characters dont get distorted
encoding = '<?xml version="1.0" encoding="UTF-8"?>\n'

def segment(foldername, bookname):
    # Takes in the file location and name of the book
    with open("././public/uploads/{}/{}.html".format(foldername, bookname + "_clean"), "r", encoding="utf8") as f:
        text = f.read()
    # Split the text at each header
    segments = re.split(r'<h1', text)

    # If segments and or a directory for the book does not exist create it
    if not os.path.exists("././public/uploads/{}/segments/".format(foldername)):
        os.makedirs("././public/uploads/{}/segments/".format(foldername))

    for i, segment in enumerate(segments[1:]):
        with open("././public/uploads/{}/segments/b{}.html".format(foldername, i + 1), "w", encoding="utf8") as f:
            # Write each segment into a seperate html file for later use
            f.write(encoding + '<h1' + segment)