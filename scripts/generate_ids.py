import re
from bs4 import BeautifulSoup
import random
import string
import shutil

def generate_id(foldername, bookname):
  # Generates ID's with a prefix for all spans that didn't get a prefix automatically provided to them by Publisher
  random_prefix = [random.choice(string.ascii_letters).lower() for i in range(3)]
  prefix = "".join(random_prefix)
  with open("././public/uploads/{}/{}.html".format(foldername, bookname), "r", encoding="utf8") as f:
    html_doc = f.read()

  soup = BeautifulSoup(html_doc, 'html.parser')

  def is_sentence(css_class):
    return css_class == "sentence"

  def has_no_id(css_id):
    return css_id is None

  spans = soup.find_all(re.compile("span"), id=has_no_id, class_=is_sentence)
  if spans:
    for i, span in enumerate(spans):
      span['id'] = prefix + '_' + str(i+1).zfill(4)

    # Replaces the Original file
    with open("././public/uploads/{}/{}.html".format(foldername, bookname), "w", encoding="utf8") as f:
      f.write(str(soup))

    # Since we are copying the file with nodejs to output but working with the upload file
    # We need to replace the copied file with our processed file
    shutil.copy("././public/uploads/{}/{}.html".format(foldername, bookname), "././public/output/{}/{}.html".format(foldername, bookname))