import re
from bs4 import BeautifulSoup

def clean(foldername, bookname):
    with open("././public/uploads/{}/{}.html".format(foldername, bookname), "r", encoding="utf8") as f:
        html_doc = f.read()

    soup = BeautifulSoup(html_doc, 'html.parser')

    def is_sentence_or_h1(css_class):
        return css_class is None or css_class == "sentence" or css_class == "title" or css_class == "page-normal"
    
    def has_id_or_not(css_id):
        pattern = re.compile("h[0-9]_[0-9]|hix[0-9]+|[a-z]+_[0-9]+")
        return css_id is None or bool(pattern.match(str(css_id)))

    # Take in all headings and spans (sentences), if they have lang or style they likely are not the ones we are looking for
    # images also taken in, though will most likely not be highlighted in the end product.
    h = soup.find_all(re.compile("span|h1|h2|h3|h4|h5|img"), id=has_id_or_not, class_=is_sentence_or_h1, lang=None, style=None)

    with open("././public/uploads/{}/{}.html".format(foldername, bookname + "_clean"), "w", encoding="utf8") as f:
        for i in h:
            # Some documents may have h2 or even h3,h4,h5?h6??
            # for simplicity sake we just change them to h1 for the segment script
            # the segment script needs to split everything on h1 basis
            # therefore we replace all headings with h1
            # The section below is a crude method but is no issue in terms of speed
            i = str(i).replace("<h2", "<h1")
            i = str(i).replace("</h2", "</h1")
            i = str(i).replace("<h3", "<h1")
            i = str(i).replace("</h3", "</h1")
            i = str(i).replace("<h4", "<h1")
            i = str(i).replace("</h4", "</h1")
            i = str(i).replace("<h5", "<h1")
            i = str(i).replace("</h5", "</h1")
            i = str(i).replace("<h6", "<h1")
            i = str(i).replace("</h6", "</h1")
            f.write(str(i) + "\n")