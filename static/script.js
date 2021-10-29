EASY = 0;
MEDIUM = 1;
HARD = 2;

CORNER = 1;
STABILITY = 2;
MOBILITY = 3;
COIN_PARITY = 4;

AIMODE = [];
var log = function (x) {
    return console.log(arguments), x;
  },
  parse = JSON.parse,
  filter = function (obj, keys) {
    var result = {};
    for (var key in obj) if (keys.indexOf(key) != -1) result[key] = obj[key];
    return result;
  },
  tag = function (tagName) {
    return function (content) {
      return "<" + tagName + ">" + content + "</" + tagName + ">";
    };
  },
  id = document.getElementById.bind(document),
  table = tag("table"),
  row = tag("tr"),
  cell = tag("td"),
  element = function (cls) {
    return cell('<span class="' + cls + '"></span>');
  },
  game = function (info) {
    info["game"] = table(
      info.board
        .split(/\n/)
        .map(function (e) {
          return row(e.split("").map(element).join(""));
        })
        .join("")
    );
    return info;
  },
  render = function (templateId, data) {
    return id(templateId).innerHTML.replace(
      /\{\{(.*?)\}\}/g,
      function (_, key) {
        return data[key];
      }
    );
  },
  load = function (templateId, data) {
    $("#show").html(render(templateId, data));
  },
  LS = localStorage,
  enterGame = function (data) {
    data = parse(data);
    var game = parse(LS.GAME || "{}");

    if (data.id != game.id) LS.GAME = JSON.stringify(data);
    else
      (game["white_token"] = data["white_token"]),
        (LS.GAME = JSON.stringify(game));

    location.hash = "/game/" + data.id;
  },
  getName = function () {
    return prompt("Please enter your name", "");
  };

$(document)
  // spectate button to watch games in all games list
  .on("click", "button.watch", function (e) {
    location.hash = "/game/" + $(e.target).parent().data("id");
  })

  .on("click", "#corner", function (e) {
    e.preventDefault();
    AIMODE.push(CORNER);
  })
  .on("click", "#stability", function (e) {
    e.preventDefault();
    AIMODE.push(STABILITY);
  })
  .on("click", "#mobility", function (e) {
    e.preventDefault();
    AIMODE.push(MOBILITY);
  })
  .on("click", "#coin", function (e) {
    e.preventDefault();
    // let corner = document.getElementById("corner").value;
    AIMODE.push(COIN_PARITY);
  })
  //  send post message for creating a new game
  .on("click", "#new-game-AI", function (e) {
    $.post(
      "/create",
      {
        name: "Hoang",
        ai: "true",
        difficulty: `${AIMODE[0]}_${AIMODE[1]}`, //{ firstmode: AIMODE[0], secondmode: AIMODE[1] }
        mode: "AI",
      },
      enterGame
    );
  })

  .on("click", "#new-game-easy", function (e) {
    e.preventDefault();
    $.post(
      "/create",
      { name: "Hoang", ai: "true", difficulty: EASY, mode: "Player" },
      enterGame
    );
  })

  .on("click", "#new-game-medium", function (e) {
    e.preventDefault();
    $.post(
      "/create",
      { name: "Hoang", ai: "true", difficulty: MEDIUM, mode: "Player" },
      enterGame
    );
  })

  .on("click", "#new-game-hard", function (e) {
    e.preventDefault();
    $.post(
      "/create",
      { name: "Hoang", ai: "true", difficulty: HARD, mode: "Player" },
      enterGame
    );
  })

  .on("click", "button.join", function () {
    var data = {
      id: $(this).parent().parent().data("id"),
      place: $(this).parent().attr("class"),
      name: getName(),
    };
    $.post("/join", data, enterGame);
  })

  //  handles clicking on a tile
  .on("click", "#game td", function () {
    var data = filter(parse(LS.GAME), ["id", "white_token", "black_token"]);
    // console.log(data);

    data["idx"] = $("#game td").index(this); // row, col
    console.log(data);
    $.post("/play", data);
  })

  .on("click", 'a[href$="#/game"]', function () {
    if (LS.GAME) return (location.hash = "/game/" + parse(LS.GAME).id), false;
    return alert("You are not currently in a game"), false;
  });

var actions = {
  game: function (data) {
    load("/game", game(data));
    $("#playerMode").modal("hide");
    $("#AImode").modal("hide");
  },
  games: function (data) {
    load("/games");
    $("#active-games").html(
      data
        .map(function (e) {
          return render("/game-state", e).replace(
            "null",
            '<button class="join">Sit</button>'
          );
        })
        .join("")
    );
  },
};

window.onhashchange = function (e) {
  var page = location.hash.slice(2);
  $.get(page, function (data) {
    actions[page.split("/")[0]](parse(data));
  });
  return false;
};
if (location.hash == "") location.hash = "/games";

setInterval(window.onhashchange, 1000);
