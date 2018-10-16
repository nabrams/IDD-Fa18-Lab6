/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function() { // we wait until the client has loaded and contacted us that it is ready to go.

    socket.emit('answer', "Hey, welcome to the game! Let's get started :)"); //We start with the introduction;
    setTimeout(timedQuestion, 4000, socket, "First things first! What is your name?"); // Wait a moment and respond with a question.

  });
  socket.on('message', (data) => { // If we get a new message from the client we process it;
    console.log(data);
    questionNum = bot(data, socket, questionNum); // run the bot function with the new message
  });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
var number= Math.floor(Math.random() * 100) + 1;
console.log(number);
function bot(data, socket, questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;
  /// These are the main statments that make up the conversation.
  if (questionNum == 0) {
    answer = 'Hello ' + input + '. Let\'s play a guessing game! I am going to pick a number between 1 and 100.'; // output response
    waitTime = 5000;
    question = 'You have 5 guesses! What is your first guess?'; // load next question
  }
  else if (questionNum == 1 && input!=number) {
    if (input > number){
      answer = 'You guessed too high!';
      waitTime = 3000;
      question = 'You have 4 guesses left!! What is your next guess?';
    }
    else{
      answer = 'You guessed too low!';
      waitTime = 3000;
      question = 'You have 4 guesses left!! What is your next guess?';
    }
  } else if (questionNum == 2 && input!=number) {
    if (input > number){
      answer = 'You guessed too high!';
      waitTime = 3000;
      question = 'You have 3 guesses left!! What is your next guess?';
    }
    else{
      answer = 'You guessed too low!';
      waitTime = 3000;
      question = 'You have 3 guesses left!! What is your next guess?';
    }
  } else if (questionNum == 3 && input!=number) {
    if (input > number){
      answer = 'You guessed too high!';
      waitTime = 3000;
      question = 'You have 2 guesses left!! What is your next guess?';
    }
    else{
      answer = 'You guessed too low!';
      waitTime = 3000;
      question = 'You have 2 guesses left!! What is your next guess?';
    }
  } else if (questionNum == 4 && input!=number) {
    if (input > number){
      answer = 'You guessed too high!';
      waitTime = 3000;
      question = 'You have 1 guess left!! What is your LAST guess?';
    }
    else{
      answer = 'You guessed too low!';
      waitTime = 3000;
      question = 'You have 1 guess left!! What is your LAST guess?';
    }
  } else {
  if (input!=number){
    answer = 'You lose :( The number was '+number ; // output response
    waitTime = 0;
    question = '';
  }
  else{
    answer = 'YOU WIN!!!'; // output response
    waitTime = 0;
    question = '';
  }
  }


  /// We take the changed data and distribute it across the required objects.
  socket.emit('answer', answer);
  setTimeout(timedQuestion, waitTime, socket, question);
  return (questionNum + 1);
}

function timedQuestion(socket, question) {
  if (question != '') {
    socket.emit('question', question);
  } else {
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
