$(document).ready(function(){
    console.log("jquery is ready!");
    //Topics button
    document.getElementById("create-topic").addEventListener("click", function(){
        location.href = "/topics.html";
    });
    //Profile page Button
    document.getElementById("editPage").addEventListener("click", function(){
        location.href = "/editP.html";
    });
});