const fileInput = document.querySelector('#upload-files input[type=file]');
fileInput.onchange = () => {
  if (fileInput.files.length > 0) {
    const fileName = document.querySelector('#upload-files .file-name');
    fileName.textContent = fileInput.files[0].name
    for (var i = 1; i < fileInput.files.length; i++) {
      fileName.textContent += ", " + fileInput.files[i].name;
      if (fileInput.files[i].name.includes("html")) {
        // Put the html file name as the uploads folder name, forwarded using the form
        document.getElementById('upload-form').action = '/upload/' + fileInput.files[i].name.split(".")[0];
      }
    }
  }
  document.getElementById('upload-form').submit();
}