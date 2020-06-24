# HBS-Full-Text-Automation

Projects goal is to automate the creation of full-text (sound and text) ebooks in epub/epub3/daisy format.

## Requirements & Setup

# Windows

- Python 3.7 https://www.python.org/downloads/release/python-370/

- Python 2.7 https://www.python.org/download/releases/2.7/

- Microsoft Visual C++ Compiler for Python 2.7 https://www.microsoft.com/EN-US/DOWNLOAD/DETAILS.ASPX?ID=44266

- Aeneas https://github.com/sillsdev/aeneas-installer/releases

Aeneas has seperate requirements that come with the aeneas-installer but can be installed seperately using pip.

- eSpeak
- FFmpeg
- Python
- BeautifulSoup4
- lxml
- numpy

If issues arise with CEW then go into System Properties -> Environment Variables,

Add a new variable under System Variables named "AENEAS_WITH_CEW" and set it to "False"

# Linux / Ubuntu

Follow the installation guide found at https://github.com/readbeyond/aeneas/blob/master/wiki/INSTALL.md

Making sure to apt install all requirements such as ffmpeg, espeak, python, pip etc.

Follow the manual procedure 1.

Use the following commands:

- $ wget https://raw.githubusercontent.com/readbeyond/aeneas/master/install_dependencies.sh
- $ bash install_dependencies.sh

If issues arrive try using the manual procedure 3.

Use the following commands:

- $ sudo pip install numpy
- $ sudo pip install aeneas

## Contributing

If you wish to contribute please contact HBS directly

## Usage

- Start the server with npm start
- Upload mp3 files with the html file
- Make sure that each mp3 file correspondes to a header (h1, h2, etc.) in the file
- Wait for the script to finish creating the smil files
- Download zip file containing smil files
- Unzip the contents into a folder containing ncc.html, bookname.html and mp3 files
- You should now have a working full-text book

## License

TBD
