// conecting the web socket server
const socket = io();

const clientsTotal = document.getElementById("clients-total");
const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

socket.on("clients-total", (data) => {
  clientsTotal.innerText = `Total clients: ${data}`;
  console.log(`Total clients connected: ${data}`);
});

function sendMessage() {
  if (messageInput.value === "") return;
  console.log(messageInput.value);
  //   created the json object and emit this to client
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dateTime: new Date(),
  };
  socket.emit("message", data);
  addMessageToUi(true, data);
  messageInput.value = "";
}

// here we are listening for event chat-message
socket.on("chat-message", (data) => {
  addMessageToUi(false, data);
});

function addMessageToUi(isOwnMessage, data) {
  clearFeedback();
  const messageElement = `<li class="${
    isOwnMessage ? "message-right" : "message-left"
  }">
                <p class="message">${data.message}
                    <span>${data.name} | ${moment(
    data.dateTime
  ).fromNow()}</span>
                </p>
            </li>`;
  messageContainer.innerHTML += messageElement;
  scrollToBottom();
}

function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener("focus", (e) => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} is typing a message`,
  });
});

messageInput.addEventListener("keypress", (e) => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} is typing a message`,
  });
});

messageInput.addEventListener("blur", (e) => {
  socket.emit("feedback", {
    feedback: "",
  });
});

socket.on("feedback", (data) => {
  clearFeedback();
  const feedbackElement = ` <li class="message-feedback">
                <p class="feedback" id="feedback">
                    ...${data.feedback}
                </p>
            </li> `;
  messageContainer.innerHTML += feedbackElement;
});

function clearFeedback() {
  document.querySelectorAll("li.message-feedback").forEach((element) => {
    element.parentNode.removeChild(element);
  });
}
