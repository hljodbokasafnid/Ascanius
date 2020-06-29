from os import listdir, rename
from os.path import isfile, join
import sys

# Testing purposes atm, not a finalized solution
# run by calling rename.py from root HBS folder with the parameters bookname and smil_prefix
# ex. python scripts/rename.py name abcd

bookname = sys.argv[1]
smil_prefix = sys.argv[2]

smilfiles = [f for f in listdir("././public/output/{}/".format(bookname)) if isfile(join("././public/output/{}/".format(bookname), f)) and f.endswith(".smil")]

for i in range(len(smilfiles)):
    rename("././public/output/{}/".format(bookname) + smilfiles[i], "././public/output/{}/".format(bookname) + smil_prefix + str(i+1).zfill(4) + ".smil")

print("All smil files found in", bookname, "folder have been renamed to", smil_prefix + "XXXX.smil format")