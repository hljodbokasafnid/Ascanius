document.querySelector('button#showModal').addEventListener('click', function (e) {
  e.preventDefault();
  var modal = document.querySelector('.modal');
  var html = document.querySelector('html');
  modal.classList.add('is-active');
  html.classList.add('is-clipped');


  modal.querySelector('.modal-background').addEventListener('click', function (e) {
    e.preventDefault();
    modal.classList.remove('is-active');
    html.classList.remove('is-clipped');
  });
});

document.getElementById('selectAll').onclick = function() {
  var checkboxes = document.querySelectorAll('input[type="checkbox"]');
  for (var checkbox of checkboxes) {
    checkbox.checked = this.checked;
  }
}

document.getElementById('confirmDelete').onclick = function() {
  // Get all the Checkboxes
  var checkboxes = document.querySelectorAll('input[type="checkbox"]');
  var delete_files = [];
  for (var checkbox of checkboxes) {
    // Add All Checked Boxes Names (file names) to the delete_files array
    if (checkbox.checked === true && (checkbox.name.endsWith(".zip") || checkbox.name.endsWith(".epub"))) {
      // All files on our server that can be deleted end with either .zip or .epub
      delete_files.push(checkbox.name);
    }
  }

  // Send POST request to the server to delete selected files

  var xhr = new XMLHttpRequest();
  xhr.open("POST", '/delete', true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify(delete_files));

  // Refresh the website and list
  window.location.reload();
}
