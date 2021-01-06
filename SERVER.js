var express = require("express");
const logger = require ('morgan')
const bodyParser =  require('body-parser')
const admin = require('firebase-admin')
var serviceAccount = require("./fir-demo-3ad41-firebase-adminsdk-l41uu-2adb8b1cd0.json");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views","./views");
app.set('views',__dirname+'/views')
app.use(logger('dev'))
const port = 5000
var server = require("http").Server(app);
var io = require("socket.io")(server);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
server.listen( process.env.PORT || port);
// var database = firebaseAdmin.database()
console.log(`Example app listening at http://localhost:${port}`)
var firebaseAdmin =admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-demo-3ad41-default-rtdb.firebaseio.com"
});

var UserArray = [];
io.on("connection", function(socket){
  console.log( socket.id + "connect");
  //chatroom
  socket.on ("Create-Room",function(data){
    socket.join(data);//join room mới
    socket.roomname = data;
    // console.log(socket.adapter.rooms);
    var array =[]
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
  socket.on('disconnect', function(){
    console.log( socket.id+ ' disconnected');
    UserArray.splice(
      UserArray.indexOf(socket.Username),1
    );
    socket.broadcast.emit("Sever-send-username-all", UserArray)
  });
});

app.get("/trangchu",function(req,res){
  res.render("trangchu.ejs");
});
app.get("/",function(req,res){s
  res.render("trangchu.ejs");
});
app.get("/chatroom.ejs",function(req,res){
  res.render("chatroom");
});
app.get("/videocall.ejs",function(req,res){
    res.render("videocall");
});
