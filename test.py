import re
from bs4 import BeautifulSoup

with open("././input/bok2/bok2unclean.html", "r", encoding="utf8") as f:
    html_doc = f.read()

soup = BeautifulSoup(html_doc, 'html.parser')

# jrrg_[0-9]+|hix[0-9]+
# swol_[0-9]+|hix[0-9]+

h = soup.find_all(re.compile("span|h1|h2"), id=re.compile("jrrg_[0-9]+|hix[0-9]+|obht_[0-9]+"))

with open("././input/bok2/bok2.html", "w", encoding="utf8") as f:
    for i in h:
        f.write(str(i) + "\n")