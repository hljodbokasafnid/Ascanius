from pydub import AudioSegment
from os import listdir
from os.path import isfile, join

mp3files = [f for f in listdir("././input/bok1/") if isfile(join("././input/bok1/", f))]
mp3files.pop()

sound = AudioSegment.from_mp3("././input/bok1/{}".format(mp3files[0]))

for i, mp3 in enumerate(mp3files[1:]):
    print(mp3)
    if ("html" not in mp3):
        nextsound = AudioSegment.from_mp3("././input/bok1/{}".format(mp3))
        sound = sound + nextsound

sound.export("././input/bok1/hljod.mp3", format="mp3")