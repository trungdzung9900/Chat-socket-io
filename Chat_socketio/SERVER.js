var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views","./views");
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

var UserArray = ["minh"];
io.on("connection", function(socket){
  console.log( socket.id + "connect");

  socket.on("client-send-Username",function(data){
    if(UserArray.indexOf(data)>=0){
      //IndexOf tìm data từ phần tử đầu của mảng =0 nếu có =>fail
      socket.emit("server-regist-fail");
    }else{
      // success
      UserArray.push(data);
      socket.Username =data;
      socket.emit("Server-regist-success", data);
      io.sockets.emit("Sever-send-username-all",UserArray);
    }
  });
  socket.on("logout",function(){
    UserArray.splice(
      UserArray.indexOf(socket.Username),1
    );
    // send người dùng đã logout cho người còn lại
    socket.broadcast.emit("Sever-send-username-all", UserArray)
  });
  socket.on("user-send-message",function(data){
    io.sockets.emit("Server-send-message", {un:socket.Username,nd:data});
  });
  socket.on("typing",function(){
    var s = socket.Username + " is typing";
    io.sockets.emit("sb-typing",s);
  });
  socket.on("none-typing",function(){
    io.sockets.emit("sb-none-typing")
  });
});
app.get("/",function(req,res){
  res.render("trangchu");
});
