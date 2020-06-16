from __future__ import unicode_literals
import youtube_dl

# This script was only used for testing purposes to get an mp3 file from youtube.

yt_link = 'https://www.youtube.com/watch?v=rU4a7AA8wM0'

ydl_opts = {
    'format': 'bestaudio/best',
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '192',
    }],
}
with youtube_dl.YoutubeDL(ydl_opts) as ydl:
    ydl.download([yt_link])