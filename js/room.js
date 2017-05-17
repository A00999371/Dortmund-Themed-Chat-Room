var userINFO;
$(document).ready(function(){
    $.ajax({
        url:"/room/roomId",
        type:"post",
        data:{
            type: "read",
        },
        success:function(resp){
            if(resp.status == "success"){
                //the resp should have roomId and roomName
                document.getElementById("status").innerHTML = "You are in room "+resp.roomId+": "+resp.roomName.room+" Description: "+resp.roomName.descr+" Cetegory: "+resp.roomName.catego;
                
                var roomIMG = document.createElement("img");
                if(resp.roomName.catego == "Opinions"){
                    roomIMG.src = "/css/images/opinions.png";
                } else if(resp.roomName.catego == "Questions"){
                    roomIMG.src = "/css/images/question.png";
                } else if(resp.roomName.catego == "Help"){
                    roomIMG.src = "/css/images/help.png";
                } else if(resp.roomName.catego == "Custom Category"){
                    roomIMG.src = resp.roomName.custURL;
                }
                roomIMG.className = "room-image";
                document.getElementById("status").appendChild(roomIMG);

                var messages = resp.arr;
                for(var i = 0; i<messages.length; i++){
                    var userIMG = document.createElement("img");
                    var ndiv = document.createElement("div");
                    var tdiv = document.createElement("div");

                    if (messages[i].user.avatar == undefined){
                        userIMG.src = "/css/images/unknown.png";
                    } else {
                        userIMG.src = messages[i].user.avatar;    
                    }
                    userIMG.className = "user-image";

                    if (messages[i].user.gencolor == undefined){
                        tdiv.style.backgroundColor = "grey";
                    } else {
                        tdiv.style.backgroundColor = messages[i].user.gencolor;    
                    }

                    var userName = "";
                    if (messages[i].user.username == undefined){
                        userName = "unknown";
                    } else {
                        userName = messages[i].user.username;    
                    }

                    ndiv.appendChild(userIMG);
                    ndiv.appendChild(tdiv);
                    tdiv.innerHTML = userName+": "+messages[i].msg;

                    document.getElementById("display").appendChild(ndiv);
                }
                //start sockets and passs the roomId over
                initSockets(resp.roomId, resp.user);
            }
        }
    })
})

//transfer all socket stuff into this function
function initSockets(roomId, user){
    //connect to the io opened tunnel in the server
    var socket = io();
    
    //send message to join a room
    socket.emit("join room", roomId);

    document.getElementById("send").addEventListener("click", function(){
        //when clicked use your socket to send a message

        //create an obj to send over
        var obj = {
            msg: document.getElementById("msg").value,
            user: user
        };

        //use your socket to send a message over and pass along the object
        //emit functions means send a message
        socket.emit("send message", obj);
    });

    //what to do if the server sends the message "create room" over
    socket.on("create message", function(obj){
        //the function(obj) obj argument holds information of what was sent over
        console.log(obj);
        console.log(obj.user.avatar);

        //create a new div, put the msg sent from other people/yourself inside
        var userIMG = document.createElement("img");
        var ndiv = document.createElement("div");
        var tdiv = document.createElement("div");
        
        if (obj.user.avatar == undefined){
            userIMG.src = "/css/images/unknown.png";
        } else {
            userIMG.src = obj.user.avatar;    
        }
        userIMG.className = "user-image";
        
        if (obj.user.gencolor == undefined){
            tdiv.style.backgroundColor = "grey";
        } else {
            tdiv.style.backgroundColor = obj.user.gencolor;    
        }
        
        var userName = "";
        if (obj.user.username == undefined){
            userName = "unknown";
        } else {
            userName = obj.user.username;    
        }
        
        ndiv.appendChild(userIMG);
        ndiv.appendChild(tdiv);
        tdiv.innerHTML = userName+": "+obj.msg;

        //append it
        document.getElementById("display").appendChild(ndiv);

    });   
}