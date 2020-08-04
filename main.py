from aeneas.executetask import ExecuteTask
from aeneas.task import Task
from os import listdir
from os.path import isfile, join
from datetime import datetime
from scripts.clean import clean
from scripts.segment import segment
from scripts.prefix import get_smil_prefix
import sys
import shutil


if __name__ == "__main__":
    try:
        # job is done whenever the for loop below has finished
        jobDone = False
        # bookname takes the name of the book.
        foldername = sys.argv[1]
        bookname = sys.argv[2]

        # Only include the mp3 files
        mp3files = [f for f in listdir("./public/uploads/{}/".format(foldername)) if isfile(join("./public/uploads/{}/".format(foldername), f)) and f.endswith(".mp3")]

        # Clean the book before segmenting
        # Combs the book for headers and sentences
        clean(foldername, bookname)

        # Segment the book
        # Outputs the segments to a seperate folder located in ./output/bookname/
        segment(foldername, bookname)

        # Only include the text files that end in html
        segments = [f for f in listdir("./public/uploads/{}/segments/".format(foldername)) if isfile(join("./public/uploads/{}/segments/".format(foldername), f)) and f.endswith(".html")]

        # There needs to be the same number of mp3 files as there are segment files. 1 to 1 ratio!
        print("{} - Number of mp3 files: {}".format(datetime.now().time().strftime("%H:%M:%S"), len(mp3files)))
        print("{} - Number of segments: {}".format(datetime.now().time().strftime("%H:%M:%S"), len(segments)))
        # Clear buffer
        sys.stdout.flush()
        
        segmentation_correct = len(mp3files) == len(segments)

        if segmentation_correct:
            smil_prefix, smil_num_len = get_smil_prefix(foldername)

            # Run through each mp3 file and book segment
            for i, mp3 in enumerate(mp3files):
                # Setup config string & absolute file path for audio/text/syncfile
                config_string = u"task_language=isl|is_text_type=unparsed|os_task_file_format=smil|os_task_file_smil_audio_ref={}|os_task_file_smil_page_ref={}.html".format(mp3, bookname)
                # Create Task
                task = Task(config_string=config_string)
                task.audio_file_path_absolute = u"./public/uploads/{}/{}".format(foldername, mp3)
                task.text_file_path_absolute = u"./public/uploads/{}/segments/b{}.html".format(foldername, i+1)
                # Each smil file is named the expected smil_prefix + number with leading zeros (3 or 4)
                task.sync_map_file_path_absolute = u"./public/output/{}/{}{}.smil".format(foldername, smil_prefix, str(i+1).zfill(smil_num_len))

                # stdout.flush forces the progress print to be relayed to the server in real time
                print("{} - {}/{}".format(datetime.now().time().strftime("%H:%M:%S"), i+1, len(mp3files)))
                # Clear buffer
                sys.stdout.flush()

                # Execute Task to output path
                ExecuteTask(task).execute()         
                task.output_sync_map_file()
            jobDone = True
        else:
            # Raise the exception if segmented files dont match mp3 files (equal number of files)
            raise Exception()
        if jobDone:
            shutil.make_archive("./public/output/{}".format(foldername), 'zip', "./public/output/{}".format(foldername))
            # This "Done" print statement is used by the server to detect when the program finishes running. (Websocket is listening for it)
            print("Done")
    except:
        print("ERROR: The number of segmentation files and mp3 files does not match.\nPlease fix, refresh and try again.")
        raise
    # Delete output/bookname/ folder and files when aeneas is done processing 
    shutil.rmtree("./public/output/{}".format(foldername))
    # Delete uploads/bookname/ folder and files when aeneas is done processing
    shutil.rmtree("./public/uploads/{}".format(foldername))