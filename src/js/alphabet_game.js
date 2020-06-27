(function () {

  "use strict";

  var is_debug = false;
  var dict;
  var next_letter = "A";
  var previous_letter = null;

  function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', '/data/alphabet_game.json', true); // Replace 'my_data' with the path to your file
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

    var image = new Image();
    image.onload = function () {
      picture.src = this.src;
      header.innerHTML = "<b>" + letter + "</b> <i>is for...</i>";
      name_obj.innerHTML = name;
      phonetic_obj.innerHTML = "<i>(/" + phonetic + "/)</i>";
      fade_in();
    };
    image.src = url;
  }

  function fade_in() {
    // TODO: add a fade in
  }

  function random_least_recent(items) {
    var min_count = items[0].count;
    for (var i = 0; i < items.length; i++) {
      var c = items[i].count;
      if (c < min_count) {
        min_count = c;
      }
    }
    var min_list = items.filter(item => item.count === min_count);
    if (min_list.length === 1) {
      min_list[0].count += 1;
    }
    var result = min_list[Math.floor(Math.random() * min_list.length)];
    return result;
  }

  function set_next_letter(letter) {
    if (letter !== 'Z') {
      next_letter = String.fromCharCode(letter.charCodeAt(0) + 1);
    } else {
      next_letter = "A";
    }

    if (letter !== 'A') {
      previous_letter = String.fromCharCode(letter.charCodeAt(0) - 1);
    } else {
      previous_letter = "Z";
    }
  }

  function update_image(letter) {
    if (letter in dict) {
      set_next_letter(letter);
      var items = dict[letter];
      var item = random_least_recent(items);
      var type = "jpg";
      if (item.type) {
        type = item.type;
      }
      var url = "/images/alphabet_game/" + item.name.toLowerCase() + "." + type;

      if (is_debug) {
        console.log(letter, "is for", item.name, "(/" + item.phonetic + "/)", ":", url);
      }

      console.log(item);
      item.count += 1;
      set_image(url, letter, item.name.replace("_", " ").replace(/[0-9]/g, "").trim(), item.phonetic);
    }
  }

  var throttled_click = _.throttle(function (event) {
    if (event.clientX != null) {
      window.ontouchstart = null;
      if (previous_letter !== null &&
        event.clientX < event.view.innerWidth / 4) { // prefer forward
        update_image(previous_letter);
      } else {
        update_image(next_letter);
      }
    } else {
      console.log(event);
      window.onclick = null;
      if (previous_letter !== null &&
        event.touches[0].clientX < event.view.innerWidth / 4) { // prefer forward
        update_image(previous_letter);
      } else {
        update_image(next_letter);
      }
    }
  }, 250);

  function toast(text) {
    var x = document.getElementById("snackbar");
    if (!x.className.includes("show")) {
      x.innerHTML = text;
      x.className = "show";
      setTimeout(function () {
        x.className = x.className.replace("show", "");
      }, 2000);
      return true;
    }
    return false;
  }

  window.onclick = throttled_click;

  window.ontouchstart = throttled_click;

  window.onkeypress = _.throttle(function (event) {
    if (event.key === '\\') {
      if (window.onclick !== null) {
        if (toast("click disabled")) {
          window.onclick = null;
        }
      } else {
        if (toast("click enabled")) {
          window.onclick = throttled_click;
        }
      }
      return;
    }
    if (event.key === '?') {
      toast("<p>HELP MESSAGE</p>" +
        "<p>Press '\\' to disable clicking</p>" +
        "<p>Click left edge to go backwards</p>");
    }
    update_image(event.key.toUpperCase());
  }, 250);

  function make_count() {
    for (var key in dict) {
      for (var index in dict[key]) {
        dict[key][index].count = 0;
      }
    }
  }

  loadJSON(function (response) {
    dict = JSON.parse(response);
    make_count();
  });

})();