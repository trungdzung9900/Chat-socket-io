var socket = io("https://maca-chat-app.herokuapp.com/");
socket.on("server-regist-fail",function(){
  alert("Username have registed")
});
socket.on("Server-regist-success",function(data){
  $("#currentUser").html(data);
  $("#loginForm").hide(2000);
  $("#chatForm").show(1000);
});
socket.on("Sever-send-username-all",function(data){
  $("#boxContent").html("");
  data.forEach(function (i) {
    $("#boxContent").append("<div class='user'>" + i + "</div>");
  });
});
socket.on("Server-send-message",function(data){
  $("#listMessages").append("<div class='ms'>"+ data.un + ":" + data.nd+"</div>")
});
socket.on("sb-typing",function(data){
  $("#thongbao").html("<img width='20px' src='images.png'>" + data);
});
socket.on("sb-none-typing",function(data){
  $("#thongbao").html("");
});
    $(document).ready(function(){
    $("#loginForm").show();
    $("#chatForm").hide();
    $("#txtMessage").focusin(function(){
      socket.emit("typing");
    });
    $("#txtMessage").focusout(function(){
      socket.emit("none-typing");
    })
    $("#btnRegister").click(function(){
      socket.emit("client-send-Username",$("#txtUsername").val());
    });
    $("#btnLogout").click(function(){
      socket.emit("logout");
      $("#loginForm").show(1000);
      $("#chatForm").hide(2000);
    });
    $(document).on('keypress',function(e) {
      if(e.which == 13) {
           socket.emit("user-send-message",$("#txtMessage").val());
      }
  });
    $("#btSendMessage").click(function(){
      socket.emit("user-send-message",$("#txtMessage").val());
    });
    });
