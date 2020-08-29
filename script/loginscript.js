var input = document.getElementById("input-text");
var join = document.getElementById("join");

var joinFuntion = () => {
  if(input.value != ""){
    var userName = input.value;
    window.location.href = "http://127.0.0.1:5500/view/chats-page.html?username=" + userName;
  }
  else return;
  
};
join.addEventListener("click", joinFuntion);
