var socket = io("https://maca-chat-app.herokuapp.com/");
socket.on("Server-send-room", function (data) {
  $("#list-room").html("");
  data.map(function (r) {
    $("#list-room").append("<h4 class='room'>" + r + "</h4>")
  })
});
socket.on("Server-send-room-name", function (data) {
  $("#Room-now").html(data);
})
socket.on("server-chat", function (data) {
  $("#right").append("<div>" + data + "</div>")
})
$(document).ready(function () {
  $("#btnCreate").click(function () {
    socket.emit("Create-Room", $("#txtUsername").val());
  });
  $("#btnSend").click(function () {
    socket.emit("user-chat", $("#txtMessage").val());
  });
});
$('div#listMessages').scrollTop($('div#listMessages')[0].scrollHeight)
