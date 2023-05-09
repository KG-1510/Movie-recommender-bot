var question = 1;
var query = '';

function formatRuntime(mins) {
  if (mins == null) {
    return 'N/A'
  } else {
    let h = Math.floor(mins / 60);
    let m = mins % 60;
    return `${h}h ${m}m`;
  }
}

function formatReleaseDate(release_date) {
  if (release_date == null) {
    return 'N/A'
  } else {
    return release_date.slice(0, 4)
  }
}

function startOver() {
  question = 1;
  query = '';
  $("#textInput").attr('readonly', false);
  $("#textInput").attr('placeholder', 'Type "skip" to skip this question');
  document.getElementById("userInput").scrollIntoView({ block: "start", behavior: "smooth" });
  $('#chatbox').children().last().removeClass();
  $('#chatbox').children().last().html('<p class="speech-bubble-user userText">start over</p>');
  var botHtml = "<div class='speech-bubble-bot botText'><div class='loading-bubble'></div><div class='loading-bubble'></div><div class='loading-bubble'></div></div>";
  $("#chatbox").append(botHtml);
  setTimeout(function () {
    $('#chatbox').children().last().html("Sure, let's go again! What movie genre(s) are you interested in?<br><i style='font-size: 16px; color: rgb(17, 39, 100)'>(if multiple, please separate them with a comma)</i>");
  }, 500);
}

function getBotResponse() {
  var rawText = $("#textInput").val();
  var userHtml = '<p class="speech-bubble-user userText">' + rawText + "</p>";
  $("#textInput").val("");
  $("#chatbox").append(userHtml);
  document.getElementById("userInput").scrollIntoView({ block: "start", behavior: "smooth" });
  // Last Question, Process Query
  if (question == 0) {
    question++;
    if (rawText != 'skip') {
      query += ' ' + rawText.toLowerCase().split(' ').join('').split(',').join(' ');
    }
    var botHtml = "<div class='speech-bubble-bot botText'><div class='loading-bubble'></div><div class='loading-bubble'></div><div class='loading-bubble'></div></div>";
    $("#chatbox").append(botHtml);
    $.get("/get", { msg: query }).done(function (data) {
      // var data = JSON.parse(data.replace(/\bNaN\b/g, 'null'));
      $('#chatbox').children().last().html('Here are some movies for you:');
      var botHtml = "<div class='movie-scrollbar'>";
      for (var i = 0; i < data.length; i++) {
        botHtml += "<a href='https://www.imdb.com/title/" + data[i][1] + "' target='_blank'><div class='movie-box'><img src='http://img.omdbapi.com/?apikey=ea75cc5f&i=" + data[i][1] + "'/><p class='movie-title'>" + data[i][0] + "</p><p class='movie-details'>" + formatRuntime(data[i][2]) + " • " + formatReleaseDate(data[i][3]) + " • IMBD: " + data[i][4] + "</p></div>";
      };
      botHtml += "</div>"
      $("#chatbox").append(botHtml);
      $("#chatbox").append("<div class='speech-bubble-start-over startOverText' onclick='startOver()'>start over</div>");
      document.getElementById("userInput").scrollIntoView({ block: "start", behavior: "smooth" });
      $("#textInput").attr('readonly', true);
      $("#textInput").attr('placeholder', 'Click on "start over"');
    });

    // First Question, Append to Query
  } else if (question == 1) {
    question++;
    var botHtml = "<div class='speech-bubble-bot botText'><div class='loading-bubble'></div><div class='loading-bubble'></div><div class='loading-bubble'></div></div>";
    $("#chatbox").append(botHtml);
    if (rawText != 'skip') {
      query += rawText.toLowerCase().split(' ').join('').split(',').join(' ');
    }
    setTimeout(function () {
      $('#chatbox').children().last().html('Got it! And who are some actors within that genre that you love?<br><i style="font-size: 16px; color: rgb(17, 39, 100)">(if multiple, please separate them with a comma)</i>');
    }, 500);

    // Second Question, Append to Query
  } else {
    question = 0;
    var botHtml = "<div class='speech-bubble-bot botText'><div class='loading-bubble'></div><div class='loading-bubble'></div><div class='loading-bubble'></div></div>";
    $("#chatbox").append(botHtml);
    if (rawText != 'skip') {
      query += ' ' + rawText.toLowerCase().split(' ').join('').split(',').join(' ');
    }
    setTimeout(function () {
      $('#chatbox').children().last().html('Amazing! Last question: who are some directors within that genre that you love?<br><i style="font-size: 16px; color: rgb(17, 39, 100)">(if multiple, please separate them with a comma)</i>');
    }, 500);
  }
}

$("#textInput").keypress(function (e) {
  if (e.which == 13 && $("#textInput").val().length > 0) {
    getBotResponse();
  }
});

function handleSendBtn() {
  if ($("#textInput").val().length > 0) {
    getBotResponse();
  }
}