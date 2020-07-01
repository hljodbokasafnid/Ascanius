const fileInput = document.querySelector('#upload-files input[type=file]');
fileInput.onchange = () => {
  $(".progress-bar").text("0%");
  $(".progress-bar").attr("value", 0);
  if (fileInput.files.length > 0) {
    const fileName = document.querySelector('#upload-files .file-name');
    fileName.textContent = "Uploading Files..";
    var formData = new FormData();
    for (var i = 0; i < fileInput.files.length; i++) {
      if (fileInput.files[i].name.includes("html")) {
        // Put the html file name as the uploads folder name, forwarded using the form
        uploadpath = '/upload/' + fileInput.files[i].name.split(".")[0];
        document.getElementById('upload-form').action = uploadpath;
      }
      formData.append('uploads', fileInput.files[i]);
    }

    $.ajax({
      url: uploadpath,
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function() {
        window.location.reload();
      },
      xhr: function() {
        var xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);

            $(".progress-bar").text(percentComplete + "%");
            $(".progress-bar").attr("value", percentComplete);

            if (percentComplete === 100) {
              console.log("upload completed, " + percentComplete + "%");
            }
          }
        }, false);

        return xhr;

      }
    });
    }
}