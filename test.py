import re
from bs4 import BeautifulSoup

with open("././input/bok3/bok3.html", "r", encoding="utf8") as f:
    html_doc = f.read()

soup = BeautifulSoup(html_doc, 'html.parser')

# jrrg_[0-9]+|hix[0-9]+

h = soup.find_all(re.compile("span|h1"), id=re.compile("swol_[0-9]+|hix[0-9]+"))

with open("././input/bok3/bok3clean.html", "w", encoding="utf8") as f:
    for i in h:
        f.write(str(i) + "\n")