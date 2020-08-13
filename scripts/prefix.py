from bs4 import BeautifulSoup

def get_smil_prefix(bookname):
    # get expected smil_prefix from ncc file
    with open("././public/uploads/{}/ncc.html".format(bookname), "r", encoding="utf8") as f:
        html_doc = f.read()

    soup = BeautifulSoup(html_doc, 'html.parser')

    # Gets the id from the first h1 it finds in the ncc file
    # returns the prefix which is the first 4 letters
    prefix = soup.find("a")['href']
    prefix = prefix.split(".")[0]

    # If the ncc file comes from Hindenburg the ncc file expects the files to be named sXXX.smil
    # If the ncc file comes from Publisher the ncc file expects the files to be named [a-z]{4}[0-9]{4}.smil
    if prefix[0] == "s" and prefix[1].isdigit():
        return ("s", 3)
    else:
        return (prefix[:4], 4)