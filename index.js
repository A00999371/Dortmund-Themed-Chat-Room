const express = require("express");
const port = process.env.PORT || 10002;
const path = require("path");
const bodyParser = require("body-parser");

//require session
const session = require("express-session");

var pF = path.resolve(__dirname, "public");
var app = express();

// create a server for socket functions but combine it with express functions
const server = require("http").createServer(app);

//create a socket server with the new server
var io = require("socket.io")(server);

app.use("/scripts", express.static("build"));
app.use("/css", express.static("css"));
app.use(bodyParser.urlencoded({
    extended: true
}));

//use sessions
app.use(session({
    secret:"whatever stuff", //for cookie handling, type whatever you want
    resave:true,
    saveUninitialized:true
}));

var allRooms = [];

//using : in the url will notify express that this part after / is not a solid link
app.get("/room/:roomindex", function(req, resp){
    
    console.log(req.params.roomindex);
    var index = req.params.roomindex;
    
    //store the room id to the sessions
    req.session.roomId = index;
    
    resp.sendFile(pF+"/room.html");
});

//get the room for the user
app.post("/room/roomId", function(req, resp){
    if(req.session.user == undefined ) {
        req.session.user = {
            username: undefined, 
            gender: undefined,
            avatar:undefined,
            gencolor: undefined
        }
    }
    
    //get it from the session variable
    var obj = {
        roomId: req.session.roomId,
        roomName: allRooms[req.session.roomId],
        arr: chatArray[req.session.roomId],
        status: "success",
        user: req.session.user
    }
    resp.send(obj);
});

//Making messages save in the rooms
var chatArray = []
app.post("/roomCRUD", function(req, resp){
    console.log(req.body);
    // if create
    if(req.body.type == "create"){
        //when we have a database puth this new room data in there
        allRooms.push(req.body.topicsOBJ); //push the name of the room into the array
        
        //push an array into an array to save messages 
        chatArray.push([]);
        
        //send data bake for good practice so there's an indication that it works
        resp.send({
            status:"success",
            topicSend: req.body.topicsOBJ,
            index:allRooms.length-1
        });  
    } else if (req.body.type == "read"){
        resp.send({
            status:"success",
            arr:allRooms
        });
    }
});

app.get("/", function(req, resp){
    resp.sendFile(pF+"/index.html");
});

io.on("connection", function(socket){
    //when a user goes to my html they will be in "connection" with my server via the port
    
    //what to do when a user sends "join room"
    socket.on("join room", function(roomId){
        socket.roomId = "room"+roomId;
        socket.join(socket.roomId);
        // Added for saving messages 
        socket.roomindex  = roomId;

    });
    
    //what to do when a user sends a message "send message" over
    socket.on("send message", function(obj){
        //function(obj) the obj argument is the obj that was sent over
        
        //tell the server to send a message "create message" to everyone
        io.to(socket.roomId).emit("create message", obj);
        
        //part of saving messages (got rid of [roomId] part) 
        chatArray[socket.roomindex].push(obj);
    });
    
    socket.on("disconnect", function(){
        //when the user leaves my html, the "disconnect" by closing the connection
    });
});

//not app.listen because we want to use the socket server now, but we can keep all the express stuff above
server.listen(port, function(err){
    if(err){
        console.log(err);
        return false;
    }
    
    console.log(port+" is running");
});

//create switchable pages
app.get("/topics.html" , function(req,resp) {
    resp.sendFile(pF+"/topics.html");
});
app.get("/editP.html" , function(req,resp) {
    resp.sendFile(pF+"/editP.html");
});
app.get("/index.html" , function(req,resp) {
    resp.sendFile(pF+"/index.html");
});

//crete server to save info as an object 
app.post("/editCRUD", function(req, resp){
    if (req.body.type == "save"){
        req.session.user = req.body.userOBJ;
        console.log(req.session.user);
        resp.send({
            status:"success",
            userObj:req.body.userOBJ
        });
    } else if (req.body.type == "read") {
        resp.send(req.session.user);
    }   
});