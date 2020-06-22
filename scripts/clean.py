import re
from bs4 import BeautifulSoup

# Open the book, keep only what we need, give the output file to the segment script

with open("././input/bok1/bok1.html", "r", encoding="utf8") as f:
    html_doc = f.read()

soup = BeautifulSoup(html_doc, 'html.parser')

h = soup.find_all(re.compile("h1|p"), id=re.compile("h[0-9]_[0-9]|hix[0-9]+"))

with open("././input/bok1/bok1clean.html", "w", encoding="utf8") as f:
    for i in h:
        f.write(str(i) + "\n")
