// Connect to io socket
var socket = io().connect('http://localhost:5500');

// Get the input and description
const fileInput = document.querySelector('#upload-files input[type=file]');
const description = document.querySelector('#upload-files .file-name');

// Get the current window location
var current = window.location.pathname;

fileInput.onchange = () => {
  var timeStarted = new Date();
  $(".progress-bar").text("0%");
  $(".progress-bar").attr("value", 0);
  if (fileInput.files.length > 0) {
    $(".progress-bar").show();
    description.textContent = "Uploading Files..";
    var formData = new FormData();
    var bookname = undefined;

    // Relay the folder name
    var foldername = fileInput.files[0]['webkitRelativePath'].split("/")[0].split(" ").join("_");
    var uploadpath = '/upload/' + foldername;
    document.getElementById('upload-form').action = uploadpath;

    for (var i = 0; i < fileInput.files.length; i++) {
      // Check whether we are uploading for aeneas or dp2
      var filename = fileInput.files[i].name;
      if (filename.includes("html") && filename !== "ncc.html") {
        // Relay the book name if aeneas
        bookname = fileInput.files[i].name.split(".")[0];
      }
      formData.append('uploads', fileInput.files[i]);
    }

    $.ajax({
      url: uploadpath,
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      xhr: function () {
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", function (evt) {
          if (evt.lengthComputable) {
            // Get the estimated time left
            var percentComplete = evt.loaded / evt.total;
            var uploadedBytes = evt.loaded;
            var totalBytes = evt.total;
            var timeElapsed = (new Date()) - timeStarted;
            var uploadSpeed = uploadedBytes / (timeElapsed/1000);
            var estimatedTimeLeft = (totalBytes - uploadedBytes) / uploadSpeed;
            var timeString = new Date(1000 * Math.ceil(estimatedTimeLeft)).toISOString().substr(11, 8);
            // Display the estimated time until upload finishes
            $(".estimated-time-left").text("Estimated Time Left: " + timeString);
            $(".file-input").attr("disabled", true);
            percentComplete = parseInt(percentComplete * 100);
            $(".progress-bar").text(percentComplete + "%");
            $(".progress-text").text(percentComplete + "%");
            $(".progress-bar").attr("value", percentComplete);

            if (percentComplete === 100) {
              if (current === "/") {
                description.textContent = "Aeneas Processing..";
              } else if (current === "/convert") {
                description.textContent = "Converting to epub3..";
              } else {
                description.textContent = "Batch Converting to epub3..";
              }
              $("#upload-files").attr("class", "file is-centered is-boxed is-info has-name is-large");
              $(".progress-bar").attr("class", "progress progress-bar is-info is-medium");
              $(".progress-text").attr("class", "progress-text heading has-text-weight-bold has-text-primary is-size-5");
              $(".estimated-time-left").attr("class", "estimated-time-left heading has-text-weight-bold has-text-primary is-size-5");
              $(".estimated-time-left").text("Upload Complete");
              $("#file-label-span").text("Upload Complete");
              // Let server know that its uploaded and that the client expects data
              // Emit Uploaded for Aeneas, Uploaded_Convert for Conversion to Epub3, Uploaded_Convert_Batch for Batch Epub3 Conversion
              if (current === "/") {
                socket.emit('uploaded', foldername, bookname);
              } else if (current === "/convert") {
                socket.emit('uploaded_convert', foldername, bookname);
              } else {
                socket.emit('uploaded_convert_batch', foldername);
              }
              $("#process-feed").show();
            }
          }
        }, false);
        return xhr;
      }
    });
  }
}

socket.on('newdata', (d) => {
  $("#process-feed").show();
  $("#process-feed").prepend(d);
});

socket.on('refresh', () => {
  description.textContent = "Processing Complete, Refreshing..";
  setTimeout(() => { location.reload(); }, 2000);
});

socket.on('error', () => {
  if (current === "/") {
    description.textContent = "Aeneas Processing Error";
  }
  else {
    description.textContent = "Conversion Processing Error";
  }
  $("#upload-files").attr("class", "file is-centered is-boxed is-danger has-name is-large");
  $("#process-feed").attr("class", "textarea is-large is-danger has-fixed-size");
});