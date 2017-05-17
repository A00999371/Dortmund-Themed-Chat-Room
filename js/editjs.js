$(document).ready(function(){
    console.log("jquery is ready!");
    //Home Button
    document.getElementById("homeP").addEventListener("click", function(){
        location.href = "/index.html";
    });
    document.getElementById("save-butt").addEventListener("click", function(){
        //Male Female check
        var male = document.getElementById("radio_male");
        var female = document.getElementById("radio_female");
        var gender = '';
        var gendercolor = '';
        if(male.checked==true){
            gender = 'male';
            gendercolor = '#ADF';
        }
        if(female.checked==true){
            gender = 'female';
            gendercolor = 'pink';
        }
        //Saving and posting the user information
       $.ajax({
            url:"/editCRUD",
            type:"post",
            data:{
                //saving user info as an object because that allows you to acces indiviudal items withn an object rather then a long list of entered values
                userOBJ:{
                    username: document.getElementById("user-name").value,
                    avatar: document.getElementById("user-avatar").value,
                    usergender: gender,
                    gencolor: gendercolor
                    
                },
                type: "save"
            },
            success:function(resp){
                console.log(resp);
                var lBarP = document.getElementById("lowerbarP");
                var URL = document.createElement("img");
                var Name = document.getElementById("name-div");
                var Gender = document.getElementById("gender-div");
                
                Name.innerHTML = "Username: "+resp.userObj.username;
                Gender.innerHTML = "Gender: "+resp.userObj.usergender;
                
                URL.src = resp.userObj.avatar;
                URL.className = "url";
                lBarP.appendChild(URL);
            }
        });
    });
});