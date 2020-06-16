from aeneas.executetask import ExecuteTask
from aeneas.task import Task


# Simple sample, 1 mp3 file for 1 txt file.

# Setup config string & absolute file path for audio/text/syncfile
config_string = u"task_language=eng|is_text_type=plain|os_task_file_format=smil|os_task_file_smil_page_ref=text.txt|os_task_file_smil_audio_ref=audio.mp3"
task = Task(config_string=config_string)
task.audio_file_path_absolute = u"./input/075_Samtal.mp3"
task.text_file_path_absolute = u"./input/075_Samtal_Pure_Text.txt"
task.sync_map_file_path_absolute = u"./output/bok1/syncfile.smil"


# Execute Task to output path
ExecuteTask(task).execute()
task.output_sync_map_file()