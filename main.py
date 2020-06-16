from aeneas.executetask import ExecuteTask
from aeneas.task import Task


# Setup config string & absolute file path for audio/text/syncfile
config_string = u"task_language=eng|is_text_type=plain|os_task_file_format=smil|os_task_file_smil_page_ref=text.txt|os_task_file_smil_audio_ref=audio.mp3"
task = Task(config_string=config_string)
task.audio_file_path_absolute = u"C:/Users/studio/Documents/test/audio.mp3"
task.text_file_path_absolute = u"C:/Users/studio/Documents/test/text.txt"
task.sync_map_file_path_absolute = u"C:/Users/studio/Documents/test/syncfile.smil"


# Execute Task to output path
ExecuteTask(task).execute()
task.output_sync_map_file()