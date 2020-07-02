from bs4 import BeautifulSoup

def get_smil_prefix(bookname):
    # get expected smil_prefix from ncc file
    with open("././public/uploads/{}/ncc.html".format(bookname), "r", encoding="utf8") as f:
        html_doc = f.read()

    soup = BeautifulSoup(html_doc, 'html.parser')

    # Gets the id from the first h1 it finds in the ncc file
    # returns the prefix which is the first 4 letters
    prefix = soup.find("h1")['id'][:4]

    return prefix