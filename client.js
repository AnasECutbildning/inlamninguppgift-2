const net = require("net");
const { resolve } = require("path");

const redline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const waitForUsername = new Promise((resolve) => {
  redline.question("Enter a username to join the chat: ", (answer) => {
    resolve(answer);
  });
});

waitForUsername.then((answer) => {
  const socket = net.connect({
    port: 1234,
  });
  socket.on('connect', () =>{
    socket.write(`${answer} has joined the chat`);
  })
  redline.on("line", (data) => {
    if (data === "quit") {
      socket.write(`${answer} has left the chat`);
      socket.setTimeout(1000);
    } else {
      socket.write(`${answer}: ${data}`);
    }
  });

  socket.on("data", (data) => {
    console.log("\x1b[33m%s\x1b[0m", data);
  });

  socket.on("timeout", () => {
    socket.write("quit ");
    socket.end();
  });

  socket.on("end", () => {
    process.exit();
  });

  socket.on("error", () => {
    console.log("the server semms to have shut down...");
  });
});
