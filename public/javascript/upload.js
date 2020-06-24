const fileInput = document.querySelector('#uploadfiles input[type=file]');
fileInput.onchange = () => {
  if (fileInput.files.length > 0) {
    const fileName = document.querySelector('#uploadfiles .file-name');
    fileName.textContent = fileInput.files[0].name
    for (var i = 1; i < fileInput.files.length; i++) {
      fileName.textContent += ", " + fileInput.files[i].name;
    }
  }
  document.getElementById('uploadform').submit();
}