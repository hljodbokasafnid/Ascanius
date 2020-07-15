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

If you wish to contribute please contact HBS directly http://www.hbs.is

## Usage

# Run
- Make sure to have [nodejs](https://nodejs.org/en/download/) installed
- Run "npm install" to install all the required dependencies
- Start the server with "npm start"
- Server should now be running on http://localhost:5000

# Syncing Audio
- Upload mp3 files, ncc.html and the book.html to the server
- Make sure that each mp3 file correspondes to a header (h1, h2, etc.) in the book file
- Wait for the script to finish creating the smil files
- Download zip file containing smil files
- Unzip the contents into a folder containing ncc.html, bookname.html, mp3 files and any other necessary files (/images, style.css)
- Open the ncc file in Hindenburg to standardize all the files
- Export epub/epub3/daisy from Hindenburg
- You should now have a working full-text book

# Converting from Daisy 2.02 to Epub 3
- Upload the folder containing the full daisy 2.02 ebook
- Validate the ebook if any errors occur
- Wait for the Daisy Pipeline to process the book
- Download the epub file and open up in a functioning ebook reader that supports Media Overlay (recommend [Thorium Reader Alpha](https://github.com/edrlab/thorium-reader/releases/tag/latest-windows))

## License

GNU General Public License v3.0
