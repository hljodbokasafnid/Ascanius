# Preprocess the incoming html file to make sure it doesn't have invalid ID's
import sys
import os
import re
from bs4 import BeautifulSoup

#TODO: Comment
#TODO: Output the preprocessing "process" to the client

def preprocess(foldername, bookname):
  with open("././public/uploads/{}/{}.html".format(foldername, bookname), "r", encoding="utf8") as f:
    html_doc = f.read()

  soup = BeautifulSoup(html_doc, 'html.parser')

  def has_invalid_id(css_id):
    pattern = re.compile("[A-z]+ [0-9]+")
    return bool(pattern.match(str(css_id)))

  # images taken in
  original = soup.find_all(re.compile("img"), id=has_invalid_id)

  # replace each id that has space in it with an underscore
  for line in original:
    # if line is found then we have to search for the id in all smil files
    for f in os.listdir("././public/uploads/{}/".format(foldername)):
      if f.endswith(".smil"):
        with open("././public/uploads/{}/{}".format(foldername, f), "r", encoding="utf8") as cf:
          current_smil = cf.read()
        current_soup = BeautifulSoup(current_smil, 'html.parser')
        current_original = current_soup.find_all(re.compile("text"), id=line['id'])
        if len(current_original) > 0:
          current_original[0]['id'] = current_original[0]['id'].replace(" ", "_")
          current_original[0]['src'] = current_original[0]['src'].replace(" ", "_")
          # Replace the original smil file with a preprocessed smil file
          with open("././public/uploads/{}/{}".format(foldername, f), "w", encoding="utf8") as cf:
            cf.write(str(current_soup))
    line['id'] = line['id'].replace(" ", "_")

  # Replace the original file with a preprocessed html file
  with open("././public/uploads/{}/{}.html".format(foldername, bookname), "w", encoding="utf8") as f:
    f.write(str(soup))

preprocess(sys.argv[1], sys.argv[2])