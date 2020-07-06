var socket = io().connect('http://localhost:5000');
const fileInput = document.querySelector('#upload-files input[type=file]');
const description = document.querySelector('#upload-files .file-name');

fileInput.onchange = () => {
  $(".progress-bar").text("0%");
  $(".progress-bar").attr("value", 0);
  if (fileInput.files.length > 0) {
    $(".progress-bar").show();
    description.textContent = "Uploading Files..";
    var formData = new FormData();
    for (var i = 0; i < fileInput.files.length; i++) {
      var filename = fileInput.files[i].name;
      if (filename.includes("html") && filename !== "ncc.html") {
        // Put the html file name as the uploads folder name, forwarded using the form
        var bookname = fileInput.files[i].name.split(".")[0];
        uploadpath = '/upload/' + bookname;
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
      xhr: function() {
        var xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
            var percentComplete = evt.loaded / evt.total;
            $(".file-input").attr("disabled", true);
            percentComplete = parseInt(percentComplete * 100);

            $(".progress-bar").text(percentComplete + "%");
            $(".progress-bar").attr("value", percentComplete);

            if (percentComplete === 100) {
              description.textContent = "Aeneas Processing.."
              $("#upload-files").attr("class", "file is-centered is-boxed is-info has-name is-large");
              $("#file-label-span").text("Upload Complete");
              //console.log("upload completed, " + percentComplete + "%");
              // Let server know that its uploaded and that the client expects data
              socket.emit('uploaded', bookname);
              $("#aeneas-feed").show();
            }
          }
        }, false);

        return xhr;

      }
    });
    }
}

socket.on('newdata', (d) => {
  //console.log(d);
  $("#aeneas-feed").prepend(d);
});

socket.on('refresh', () => {
  description.textContent = "Processing Complete, Refreshing.."
  setTimeout(() => {  location.reload(); }, 2000);
});

socket.on('error', () => {
  description.textContent = "Aeneas Processing Error"
  $("#upload-files").attr("class", "file is-centered is-boxed is-danger has-name is-large");
  $("#aeneas-feed").attr("class", "textarea is-large is-danger has-fixed-size");
});