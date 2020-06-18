from aeneas.executetask import ExecuteTask
from aeneas.task import Task


# Simple sample, 1 mp3 file for 1 txt file.

# Setup config string & absolute file path for audio/text/syncfile
config_string = u"task_language=eng|is_text_type=unparsed|is_text_unparsed_id_regex=h*|os_task_file_format=smil|os_task_file_smil_page_ref=b27919.html|os_task_file_smil_audio_ref=01_n_eigin_saga_4_Pipark_kuh_si.mp3"
task = Task(config_string=config_string)
task.audio_file_path_absolute = u"./input/bok1/01_n_eigin_saga_4_Pipark_kuh_si.mp3"
task.text_file_path_absolute = u"./input/bok1/b27919.html"
task.sync_map_file_path_absolute = u"./output/bok1/syncfile.smil"


# Execute Task to output path
ExecuteTask(task).execute()
task.output_sync_map_file()