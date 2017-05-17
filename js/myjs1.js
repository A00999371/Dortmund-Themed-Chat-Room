var topicsBody = document.getElementById("display_t");
$(document).ready(function(){
    console.log("jquery is ready!");
        //ajax to get the array of existing rooms
        $.ajax({
            url:"/roomCRUD",
            type:"post",
            data:{
                type:"read" //because index.js is configured to detect "read" 
            },
            success:function(resp){
                //should send an array back if succesfull
                if(resp.status == "success"){
                    var rooms = resp.arr;
                    for(var i = 0; i<rooms.length; i++){
                        var topicIMG = document.createElement("img");
                        var ndiv = document.createElement("div");
                        ndiv.innerHTML = "Room: "+rooms[i].room+" Description: "+rooms[i].descr+" Category: "+rooms[i].catego;
                        ndiv.style.backgroundColor = "#ADF";
                        ndiv.style.padding = "5px";
                        ndiv.style.margin = "5px";
                        
                        if(rooms[i].catego == "Opinions"){
                        topicIMG.src = "/css/images/opinions.png";
                        } else if(rooms[i].catego == "Questions"){
                            topicIMG.src = "/css/images/question.png";
                        } else if(rooms[i].catego == "Help"){
                            topicIMG.src = "/css/images/help.png";
                        } else if(rooms[i].catego == "Custom Category"){
                            topicIMG.src = rooms[i].custURL;;
                        }
                        topicIMG.className = "topic-image";
                        ndiv.appendChild(topicIMG);
                        topicsBody.appendChild(ndiv);
                        
                        //store the index of the array into the div using a custom property
                        ndiv.myindex = i;
                        ndiv.addEventListener("click", function(){
                            //change the location to this new link with index as the parameter
                            location.href = "/room/"+this.myindex;
                        });
                    }
                }
            }
        });
    document.getElementById("create").addEventListener("click", function(){
        //ajax to get the array of existing rooms
        $.ajax({
            url:"/roomCRUD",
            type:"post",
            data:{
                topicsOBJ:{
                room: document.getElementById("room").value,
                descr: document.getElementById("room_desc").value,
                catego: document.getElementById("category").value,
                custURL: document.getElementById("catego_cust_image").value, 
                },
                type: "create"
            },
            success:function(resp){
                console.log(resp);
                
                if(resp.status == "success"){
                    //if the server responds with a success message
                    var topicIMG = document.createElement("img");
                    var ndiv = document.createElement("div");
                    ndiv.innerHTML = "Room: "+resp.topicSend.room+" Description: "+resp.topicSend.descr+" Category: "+resp.topicSend.catego;
                    ndiv.style.backgroundColor = "#ADF";
                    ndiv.style.padding = "5px";
                    ndiv.style.margin = "5px";
                    
                    if(resp.topicSend.catego == "Opinions"){
                        topicIMG.src = "/css/images/opinions.png";
                    } else if(resp.topicSend.catego == "Questions"){
                        topicIMG.src = "/css/images/question.png";
                    } else if(resp.topicSend.catego == "Help"){
                        topicIMG.src = "/css/images/help.png";
                    } else if (resp.topicSend.catego =="Custom Category" && resp.topicSend.custURL != undefined) {
                        topicIMG.src = resp.topicSend.custURL;
                    }
                    topicIMG.className = "topic-image";
                    ndiv.appendChild(topicIMG);
                    topicsBody.appendChild(ndiv);

                    //store the index of the array into the div using a custom property
                    ndiv.myindex = resp.index;
                    ndiv.addEventListener("click", function(){
                        //change the location to this new link with index as the parameter
                        location.href = "/room/"+this.myindex;
                    });
                }
            }
        });
    });
    // for swtiching pages
    document.getElementById("homeT").addEventListener("click", function(){
        location.href = "/index.html";
    });
});
