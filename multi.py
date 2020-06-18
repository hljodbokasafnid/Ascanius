from aeneas.executetask import ExecuteTask
from aeneas.task import Task
from os import listdir
from os.path import isfile, join

mp3files = [f for f in listdir("./input/bok1/") if isfile(join("./input/bok1/", f))]

# removes html file
mp3files.pop()
#print(mp3files)

# Currently not working

for i, mp3 in enumerate(mp3files):
    # Setup config string & absolute file path for audio/text/syncfile
    config_string = u"task_language=isl|is_text_type=unparsed|is_text_unparsed_id_regex=h*|os_task_file_format=smil|os_task_file_smil_audio_ref={}|os_task_file_smil_page_ref=b27919.html".format(mp3)
    task = Task(config_string=config_string)
    task.audio_file_path_absolute = u"./input/bok1/{}".format(mp3)
    task.text_file_path_absolute = u"./input/bok1/b{}.html".format(i)
    task.sync_map_file_path_absolute = u"./output/bok1/s0{}.smil".format(i+1)

    print("Running task nr:", i+1)

    # Execute Task to output path
    ExecuteTask(task).execute()
    task.output_sync_map_file()