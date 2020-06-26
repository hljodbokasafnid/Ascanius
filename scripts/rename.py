from os import listdir, rename
from os.path import isfile, join

smilfiles = [f for f in listdir("././public/output/bok2/") if isfile(join("././public/output/bok2/", f)) and f.endswith(".smil")]

for i in range(len(smilfiles)):
    rename("././public/output/bok2/" + smilfiles[i], "././public/output/bok2/" + "tpca" + str(i+1).zfill(4) + ".smil")
print(smilfiles)