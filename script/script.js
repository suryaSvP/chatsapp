//client server js
const socket = io("http://localhost:3000");
const sampleButton = document.getElementById("sample-button");
const messageTextArea = document.getElementById("comment-text-area");
const msgContainer = document.getElementById("comment_list");
socket.on("chat-message-updated", (updateObj) => {
  if(updateObj.toUpdate == loginedUser){
    appendMessage(updateObj);
  }
  
});

sampleButton.addEventListener("click", (e) => {
  e.preventDefault();
  const msg = messageTextArea.value;
  let msgObj = {
    sender: loginedUser,
    reciever: currentClickedUser,
    message: msg
  };
  socket.emit("send-chat-message", msgObj);
  messageTextArea.value = "";
});

function appendMessage(message) {
  const msgElement = document.createElement("div");
  msgElement.innerHTML = message;
  msgElement.className = "comment sender";

  var commentWrapper = document.createElement("div");
  commentWrapper.className = "comment_wrapper";

  commentWrapper.appendChild(msgElement);
  msgContainer.appendChild(commentWrapper);
}
// client js
var nameList = [];
var nameClick = document.getElementById("name-click");
var commentDetails = {};

var allChatsInDb = {
  suryaNames: ["kiran", "vishnu"],
  vishnuNames: ["surya", "sanjay"],
  suryaComments: {
    kiran: [{ value: "dei", sent: true }],
    vishnu: [
      { value: "dei kura", sent: true },
      { value: "poda vena", sent: false },
      { value: "ne poda", sent: true },
      { value: "poda vena maiyuru", sent: false },
    ],
  },
  vishnuComments: {
    sanjay: [{ value: "dei", sent: true }],
    surya: [
      { value: "dei kura", sent: false },
      { value: "poda vena", sent: true },
      { value: "ne poda", sent: false },
      { value: "poda vena maiyuru", sent: true },
    ],
  },
};

function screenLoad() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const loginedUser = urlParams.get("username");
  console.log(loginedUser);
  nameList = allChatsInDb[loginedUser + "Names"];
  commentDetails = allChatsInDb[loginedUser + "Comments"];
  renderNames();
}

var currentClickedUser = "";
var nameClickFunction = () => {
  addName();
};
// nameClick.addEventListener("click", nameClickFunction);

function addName() {
  var inputText = document.getElementById("input-text");
  let newName = inputText.value;
  nameList.push(newName);
  commentDetails[newName] = [];
  renderName(newName);
  inputText.value = "";
}

function renderNames() {
  for (var j = 0; j < nameList.length; j++) {
    renderName(nameList[j]);
  }
}

function renderName(name) {
  var nameListParent = document.getElementById("names-list");
  var namePhoto = document.createElement("div");
  namePhoto.className = "name-photo";

  var image = document.createElement("img");
  image.src = "../assets/img_avatar2.png";
  image.className = "profile-pic";

  var nameDiv = document.createElement("div");
  nameDiv.id = name;
  nameDiv.addEventListener("click", handleClick);
  nameDiv.className = "name";
  nameDiv.innerHTML = name;

  var nameStatusWrapper = document.createElement("div");
  nameStatusWrapper.className = "name-status-wrapper";

  var nameStatus = document.createElement("div");
  nameStatus.className = "name-status";

  var nameWrapper = document.createElement("div");
  nameWrapper.className = "name-wrapper";
  namePhoto.appendChild(image);
  nameWrapper.appendChild(namePhoto);
  nameWrapper.appendChild(nameDiv);
  nameWrapper.appendChild(nameStatusWrapper);
  nameStatusWrapper.appendChild(nameStatus);
  nameListParent.appendChild(nameWrapper);
}

var handleClick = (event) => {
  var id = event.target.id;
  renderComments(commentDetails[id]);
  currentClickedUser = id;
  var changeName = document.getElementById("comment-id");
  changeName.innerHTML = currentClickedUser;
};

function renderComments(commentList) {
  var commentParent = document.getElementById("parent-id");
  var prevcomment = document.getElementById("comment_list");
  removeElement(prevcomment);

  var secParent = document.createElement("div");
  secParent.className = "comment-section";
  secParent.id = "comment_list";
  commentParent.appendChild(secParent);

  for (var i = 0; i < commentList.length; i++) {
    var comment = document.createElement("div");
    comment.id = "comment_text" + i;
    comment.classList.add("comment");

    comment.innerHTML = commentList[i].value;
    if (commentList[i].sent) {
      comment.classList.add("sender");
    }
    var commentWrapper = document.createElement("div");
    commentWrapper.className = "comment_wrapper";

    commentWrapper.appendChild(comment);
    secParent.appendChild(commentWrapper);
  }
}

function removeElement(element) {
  if (element) {
    element.remove();
  }
}

function removeLastChild(element) {
  if (element.lastElementChild) {
    element.removeChild(element.lastElementChild);
  }
}
function removeChildren(element) {
  while (element.lastElementChild) {
    element.removeChild(element.lastElementChild);
  }
}

var commentButton = document.getElementById("comment-button");
var addComment = () => {
  var commentTextarea = document.getElementById("comment-text-area");
  var secParent = document.getElementById("comment_list");

  if (commentTextarea.value != "" && currentClickedUser != "") {
    var message = {
      value: commentTextarea.value,
      sent: true,
    };
    console.log(commentTextarea.value);

    var newComments = document.createElement("div");
    newComments.id = "comment_text";
    newComments.className = "comment sender";
    newComments.innerHTML = commentTextarea.value;

    var commentWrapper = document.createElement("div");
    commentWrapper.className = "comment_wrapper";

    commentWrapper.appendChild(newComments);
    secParent.appendChild(commentWrapper);

    commentDetails[currentClickedUser].push(message);
    commentTextarea.value = "";
  } else return;
};
commentButton.addEventListener("click", addComment);
document.messageMe = (user, text) => {
  let message = {
    value: text,
    sent: false,
  };
  commentDetails[user].push(message);
  renderComments(commentDetails[user]);
};

screenLoad();
