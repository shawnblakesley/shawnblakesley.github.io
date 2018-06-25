
(function () {

  "use strict";

  var is_debug = false;
  var dict;

  function loadJSON(callback) {   
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'data/alphabet_game.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
  }

  function fade_out() {
    // TODO: add a fade out
  }

  function set_image(url, letter, name, phonetic) {
    fade_out(); // TODO: actually fade out
    var picture = document.getElementById("picture");
    var header = document.getElementById("letter-header");
    var name_obj = document.getElementById("letter-name");
    var phonetic_obj = document.getElementById("letter-phonetic");

    header.innerHTML = "<b>" + letter + "</b> <i>is for...</i>";
    name_obj.innerHTML = name;
    phonetic_obj.innerHTML = "<i>(/" + phonetic + "/)</i>";
    var image = new Image();
    image.onload = function(){
      picture.src = this.src;
      fade_in()
    };
    image.src = url;
  }

  function fade_in() {
    // TODO: add a fade in
  }

  function update_image(letter) {
    if (letter in dict) {
      var items = dict[letter]
      var item = items[Math.floor(Math.random()*items.length)]; // TODO: change to randomly pick from least recently used
      var type = "jpg";
      if (item.type) {
        type = item.type;
      }
      var url = "images/alphabet_game/" + item.name.toLowerCase() + "." + type;
      
      if (is_debug) {
        console.log(letter, "is for", item.name, "(/" + item.phonetic + "/)", ":", url);
      }

      set_image(url, letter, item.name.replace("_", " "), item.phonetic);
    }
  }

  window.onkeypress = _.throttle(function(event){
    update_image(event.key.toUpperCase());
  }, 250);

  loadJSON(function(response) {
    dict = JSON.parse(response);
  });

})();