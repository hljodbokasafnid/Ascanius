import re

with open("././input/bok1/b27919.html", "r", encoding="utf8") as f:
    text = f.read()

segments = re.split(r'<h1', text)

print(len(segments))

for i, segment in enumerate(segments[1:]):
    with open("././input/bok1/b{}.html".format(i), "w", encoding="utf8") as f:
        f.write("<h1" + segment)