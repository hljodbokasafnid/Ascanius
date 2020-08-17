# HBS-Full-Text-Automation

Project goal is to automate the creation of accessible full-text (sound and text synced) ebooks in epub3 and daisy format.

# Aeneas

[Aeneas](https://www.readbeyond.it/aeneas/) is used to sync the audio and html (text) files automatically.

## Requirements & Setup

### Windows

- [Python 3.7+](https://www.python.org/downloads/)

- [Python 2.7](https://www.python.org/download/releases/2.7/)

- [Microsoft Visual C++ Compiler for Python 2.7](https://www.microsoft.com/EN-US/DOWNLOAD/DETAILS.ASPX?ID=44266)

- [Aeneas](https://github.com/sillsdev/aeneas-installer/releases)

Aeneas has its own requirements that come with the aeneas-installer but can also be installed seperately using pip.

- eSpeak
- FFmpeg
- Python
- BeautifulSoup4
- lxml
- numpy

If issues arise with CEW then go into System Properties -> Environment Variables,

Add a new variable under System Variables named "AENEAS_WITH_CEW" and set it to "False"

### Linux / Ubuntu

Follow the installation guide found at https://github.com/readbeyond/aeneas/blob/master/wiki/INSTALL.md

Making sure to apt install all requirements such as ffmpeg, espeak, python, pip etc.

Follow the manual procedure 1.

Use the following commands:

- $ wget https://raw.githubusercontent.com/readbeyond/aeneas/master/install_dependencies.sh
- $ bash install_dependencies.sh

Try running "python -m aeneas.diagnostics" to see whether everything is installed correctly.

If issues arrive try also using the manual procedure 3.

Use the following commands:

- $ sudo pip install numpy
- $ sudo pip install aeneas

Rerun "python -m aeneas.diagnostics" to see whether everything is installed correctly.

# Daisy Pipeline 2

[Daisy Pipeline 2](https://daisy.github.io/pipeline/Download.html) has numerous scripts available to the user.
Their GUI program is capable of running all these scripts though we are using the CLI to automate the process even further.

## Requirements & Setup

Before installing the Daisy Pipeline 2, install [Java version 14](https://www.oracle.com/java/technologies/javase-jdk14-downloads.html)

Daisy Pipeline 2 requires at least version 11 of Java, but there were some issues with using version 11 in early tests.

Follow the [installation guide](https://daisy.github.io/pipeline/Download.html)

Make sure the install package includes [the CLI](https://github.com/daisy/pipeline-cli-go/releases), also available as a seperate download.

If the Pipeline installer prompts you to install java 11 through them press "No".

Open up a command line and use the command
- "dp2.exe help" (windows)
- "dp2 help" (linux, add 'export PATH="$PATH:/opt/daisy-pipeline2-cli/"' to ~/.bashrc (remove '') to see if the webserver and everything else is working correctly.

## Contributing

If you wish to contribute please contact HBS directly at hbs@hbs.is

## Usage

### Run
- Make sure to have [nodejs](https://nodejs.org/en/download/) and [npm](https://www.npmjs.com/get-npm) installed
- Run "npm install" to install all the required dependencies
- Start the server with "npm start"
- Server should now be running on http://localhost:5000

### Syncing Audio
- Upload mp3 files, ncc.html and the book.html to the server
- Make sure that each mp3 file correspondes to a header (h1, h2, etc.) in the book file
- Wait for the script to finish creating the smil files
- Download zip file containing smil files
- Unzip the contents into a folder containing ncc.html, bookname.html, mp3 files and any other necessary files (/images, style.css)
- Open the ncc file in Hindenburg to standardize all the files
- Export epub/epub3/daisy from Hindenburg
- You should now have a working full-text book

### Converting from Daisy 2.02 to Epub 3
- Upload the folder containing a valid daisy 2.02 ebook
- Validate the ebook if any errors occur
- Wait for the Daisy Pipeline 2 to process the book
- Download the epub file and open up in a ebook reader that supports Media Overlay (recommend [Thorium Reader Alpha](https://github.com/edrlab/thorium-reader/releases/tag/latest-windows))

### Batch Conversion of Daisy 2.02 to Epub 3
- Upload a folder containing nothing but valid daisy 2.02 ebooks
- Wait for the conversion to finish
- Download a zip file containing all books as epub 3 and or log files of failed books
- Some books may need to be fixed before re-running them, also converting them by themselves may be a better option

## License

GNU General Public License v3.0
