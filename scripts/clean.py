import re
from bs4 import BeautifulSoup

def clean(bookname):
    with open("././public/uploads/{}/{}.html".format(bookname, bookname), "r", encoding="utf8") as f:
        html_doc = f.read()

    soup = BeautifulSoup(html_doc, 'html.parser')

    # jrrg_[0-9]+|hix[0-9]+
    # swol_[0-9]+|hix[0-9]+

    def is_sentence_or_h1(css_class):
        return css_class is None or css_class == "sentence" or css_class == "title"

    h = soup.find_all(re.compile("span|h1|h2|h3|h4"), id=re.compile("h[0-9]_[0-9]|"), class_=is_sentence_or_h1)

    with open("././public/uploads/{}/{}.html".format(bookname, bookname), "w", encoding="utf8") as f:
        for i in h:
            # Some documents may have h2 or even h3,h4,h5?h6??
            # for simplicity sake we just change them to h1 for the segment script
            # the segment script needs to split everything on h1 basis
            # therefore we replace all headings with h1
            i = str(i).replace("<h2", "<h1")
            i = str(i).replace("</h2", "</h1")
            i = str(i).replace("<h3", "<h1")
            i = str(i).replace("</h3", "</h1")
            i = str(i).replace("<h4", "<h1")
            i = str(i).replace("</h4", "</h1")
            f.write(str(i) + "\n")