from pydub import AudioSegment
from os import listdir
from os.path import isfile, join

# Redundant code, may be deleted later
# Was used for testing purposes
# Having 1 large audio file and 1 full-length html text does not work well with Aeneas
# Keeping this code for now if needed later for further testing

mp3files = [f for f in listdir("././public/uploads/bok1/") if isfile(join("././public/uploads/bok1/", f))]
mp3files.pop()

sound = AudioSegment.from_mp3("././public/uploads/bok1/{}".format(mp3files[0]))

for i, mp3 in enumerate(mp3files[1:]):
    print(mp3)
    if ("html" not in mp3):
        nextsound = AudioSegment.from_mp3("././public/uploads/bok1/{}".format(mp3))
        sound = sound + nextsound

sound.export("././public/uploads/bok1/hljod.mp3", format="mp3")