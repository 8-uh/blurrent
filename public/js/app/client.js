
var nsfwBtn = document.getElementById('nsfwBtn');

nsfwBtn.addEventListener('click', function(e) {
  var btn = e.target;
  btn.disabled = true;
  console.log(e.target.dataset);
  
  var xmlhttp = new XMLHttpRequest();
  
  xmlhttp.open("PUT","/markNSFW/" + btn.dataset.src);
  xmlhttp.send();
});