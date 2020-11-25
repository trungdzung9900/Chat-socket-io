var express = require("express");
var app = express();
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views","./views");
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(5000);

var UserArray = ["minh"];
io.on("connection", function(socket){
  console.log( socket.id + "connect");
  //chatroom
  socket.on ("Create-Room",function(data){
    socket.join(data);//join room mới
    socket.rooms = data;
    // console.log(socket.adapter.rooms);
    var array =[]
    console.log(array)
    for(r in socket.adapter.rooms){
      array.push(r);
      }
      io.sockets.emit("Server-send-room", array);
      //gửi tên phòng client đang ở
      socket.emit("Server-send-room-name", data)
  });
  socket.on("user-chat",function(data){
    io.sockets.in(socket.roomname).emit("server-chat",data)
  });

  //chat private
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
app.get("/chatroom.ejs",function(req,res){
  res.render("chatroom");
});
app.get("/videocall.ejs",function(req,res){
    res.render("videocall");
});
