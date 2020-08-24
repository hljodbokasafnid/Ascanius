import re
import html
from datetime import datetime
from bs4 import BeautifulSoup, element
from os import listdir
from os.path import isfile, join
from decimal import *

xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
doctype = '<!DOCTYPE smil PUBLIC "-//W3C//DTD SMIL 1.0//EN" "http://www.w3.org/TR/REC-smil/SMIL10.dtd">\n'

# REVIEW Metadata in head looks to be optional, is included below just in case

def get_seconds(time_string):
  hour, minute, seconds = time_string.split(':')
  return '{0:.3f}'.format(int(hour) * 3600 + int(minute) * 60 + float(seconds))

def get_hms(time_float):
  seconds, milliseconds = str(float(time_float)).split('.')
  minutes, seconds = divmod(int(seconds), 60)
  hours, minutes = divmod(int(minutes), 60)
  # Dealing with floating point error with Decimal Module
  milliseconds = str(Decimal(str("0." + milliseconds)).quantize(Decimal('.001'), rounding=ROUND_DOWN)).split('.')[1]
  return "%02d:%02d:%02d.%s" % (hours, minutes, seconds, milliseconds)

def process_smil_files(foldername):
  smil_files = [f for f in listdir("././public/output/{}/".format(foldername)) if isfile(join("././public/output/{}/".format(foldername), f)) and f.endswith(".smil") and not 'master' in f]
  
  # Check for meta (if meta, dont run)
  with open('././public/output/{}/{}'.format(foldername, smil_files[0]), 'r', encoding='utf8') as f:
    first_smil = f.read()
  
  first_soup = BeautifulSoup(first_smil, 'html.parser')

  rerun = first_soup.find(re.compile('meta'))

  if not rerun:
    total_elapsed_time_float = 0.0
    with open('././public/output/{}/ncc.html'.format(foldername), 'r', encoding='utf8') as f:
      ncc = f.read()

    # Grab another soup
    ncc = BeautifulSoup(ncc, 'xml')

    # Grab the metadata we want, title, identifier, format, generator 
    # (will also generate total elapsed time and timeinthissmil)
    for i in ncc.find_all(re.compile('meta')):
      try:
        if i['name'] == 'dc:title':
          meta_title = ncc.new_tag('meta', attrs={ 'name':i['name'], 'content':i['content'] })
        if i['name'] == 'dc:identifier':
          meta_identifier = ncc.new_tag('meta', attrs={ 'name':i['name'], 'content':i['content'] })
        if i['name'] == 'dc:format':
          meta_format = ncc.new_tag('meta', attrs={ 'name':i['name'], 'content':i['content'] })
        if i['name'] == 'ncc:generator':
          meta_generator = ncc.new_tag('meta', attrs={ 'name':i['name'], 'content':i['content'] })
      except:
        pass
    for index, smil_file in enumerate(smil_files):
      # Open each smil file
      with open('././public/output/{}/{}'.format(foldername, smil_file), 'r', encoding='utf8') as f:
        smil = f.read()

      # Turn it into soup
      soup = BeautifulSoup(xml + doctype + smil, 'xml')

      # Clean smil tag
      smil_tag = soup.find(re.compile('smil'))
      if smil_tag:
        smil_tag.attrs = {}

        # Add head
        new_head = soup.new_tag('head')
        smil_tag.insert(0, new_head)

        # Add Layout with region txtView to head
        new_layout = soup.new_tag('layout')
        new_region = soup.new_tag('region', id='txtView')
        new_head.insert(0, new_layout)
        new_layout.insert(0, new_region)

        par_tags = soup.find_all(re.compile('par'))
        for par_index, par_tag in enumerate(par_tags):
          par_tag.attrs = { 'id': 'par' + str(par_index + 1), 'endsync': 'last' }

        # Process each text format

        text_tags = soup.find_all(re.compile('text'))
        for text_tag in text_tags:
          text_id = text_tag['src'].split('#')[1]
          text_tag.attrs = { 'id': text_id, 'src': text_tag['src'] }

        # Process each audio format

        audio_tags = soup.find_all(re.compile('audio'))

        # last audio tag clip end into meta

        meta_time_in_smil = soup.new_tag('meta', attrs={ 'name':'ncc:timeInThisSmil', 'content':audio_tags[-1]['clipEnd']})

        for audio_index, audio_tag in enumerate(audio_tags):
          audio_id = 'aud' + str(audio_index + 1).zfill(3)
          audio_clip_begin = 'npt=' + get_seconds(audio_tag['clipBegin']) + 's'
          audio_clip_end = 'npt=' + get_seconds(audio_tag['clipEnd']) + 's'
          dur = get_seconds(audio_tag['clipEnd'])
          audio_src = audio_tag['src']

          audio_tag.attrs = { 'id': audio_id, 'clip-begin': audio_clip_begin, 'clip-end': audio_clip_end, 'src': audio_src }

        # Process seq format get last audio dur
        seq_tag = soup.find(re.compile('seq'))
        seq_tag.attrs = { 'id': 'main', 'dur': dur + 's'}

        # Total elapsed time
        meta_total_elapsed_time = soup.new_tag('meta', attrs={ 'name':'ncc:totalElapsedTime', 'content':get_hms(total_elapsed_time_float) })

        # Add the metadata to head
        new_head.insert(0, meta_generator)
        new_head.insert(0, meta_time_in_smil)
        new_head.insert(0, meta_total_elapsed_time)
        new_head.insert(0, meta_identifier)
        new_head.insert(0, meta_format)
        new_head.insert(0, meta_title)

        # Update total_elapsed_time_float
        total_elapsed_time_float += float(dur)

        # Overwrite the original file
        with open(smil_file, 'w', encoding='utf8') as f:
          f.write(soup.decode("utf8"))