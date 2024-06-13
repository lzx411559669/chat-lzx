// main.js

function sendMessage() {
  const input = document.getElementById('messageInput');
  const message = input.value.trim();
  if (message) {
      const messagesDiv = document.getElementById('messages');
      const newMessage = document.createElement('div');
      newMessage.textContent = message;
      messagesDiv.appendChild(newMessage);
      input.value = '';
  }
}
