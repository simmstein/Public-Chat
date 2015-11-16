/*
Copyright (c) <2015-2015> <Freddy Nawfal - http://playandcode.ml - zefreddy.na@gmail.com>



Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:



The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.



THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/


try {
  var app = require('express')(),
      server = require('http').createServer(app),
      io = require('socket.io').listen(server)
      fs = require('fs');
  var htmlspecialchars = require('htmlspecialchars');
} catch (e) {
  throw "CERTAINS MODULES SONT MANQUANTS, VEUILLEZ EFFECTUER UN npm install";
}



// =========================================================================
//                  ENTER YOUR SERVER SETTINGS BELOW

var config = {
  name:"Official public chat", // Name of your chat
  motd:"Bienvenue sur le serveur officiel de Public Chat", // Description of your chat
  chatTimeout:"2000", // Minimum time between two messages
  color:"purple", //Server color in chat
  defaultName:"Anonyme", //Default name if client did not enter one
  maxLastMsgs:5, // Maximum messages saved
  maxClients:0, // 0 for unlimited clients
  password:0, // 0 for no password
  PORT:8080, // Port on which your server will be running
  seeMsgs:true // True to see all messages, false to hide all in console
};

// =========================================================================

function LAUNCH(){
  console.log('=========================================================');
  console.log('Serveur "'+config.name+'" lancé sur le port: '+config.PORT);
  console.log('Les paramètres sont les suivants: ');
  console.log(' || MOTD: '+config.motd);
  console.log(' || Temps minimum entre deux messages: '+config.chatTimeout);
  console.log(' || Couleur du Serveur: '+config.color);
  console.log(' || Max de messages stockés: '+config.maxLastMsgs);
  if(config.password) console.log(' || Le mot de passe est: '+config.password);
  if(config.maxClients) console.log(' || Le serveur est limité à '+config.maxClients+' clients');
  if(config.seeMsgs) console.log(' || Les messages seront visibles sur la console.');
  console.log('En attente de clients...');
  console.log('=========================================================\n');
}


var clients = [];
var messages = [];


io.sockets.on('connection', function (socket, pseudo) {
  var query = JSON.parse(socket.handshake.query.q);
    if((config.maxClients && clients.length>=config.maxClients) || (config.password && query.mdp!=config.password)) {setTimeout(function(){socket.disconnect();},200);}
    else{
      var pseudo = query.pseudo;
      pseudo = htmlspecialchars((pseudo));
      var len = pseudo.length;
      if (len >= 15) {
        pseudo = pseudo.substring(0, 15);
      }
      if(len <= 0){
        pseudo = config.defaultName;
      }
      console.log(pseudo+" connecté");
      clients.push({pseudo:pseudo,id:socket.id});
      socket.pseudo = pseudo;
      socket.color = "black";
      socket.lastmsg = Date.now();
      socket.broadcast.emit('nouveau_client', pseudo);
      io.emit('clients',clients);
      socket.emit('serverinfo', config);
      if(messages.length){
        socket.emit('lastmsgs', messages);
      }
    }


    socket.on('message', function (message) {
        message = htmlspecialchars((message));
        var now = Date.now();
        var len = message.length;
        if(message.length > 1){
          if (len >= 150) {
            message = message.substring(0, 150);
          }
          if(message.indexOf("/") == 0){
            if(message == "/disconnect"){
              socket.disconnect();
            }
            socket.color = message.split(" ").pop();
            socket.emit('message', {pseudo:"SERVER",message:'Couleur changée en <i style="color:'+socket.color+'">'+socket.color+'</i>',color:config.color});
          }
          else{
            if((now-socket.lastmsg) >= config.chatTimeout){
              socket.lastmsg = now;
              io.emit('message', {pseudo: socket.pseudo, message: message, color:socket.color});
              messages.push({message:message, pseudo:socket.pseudo, date:displayDate(), color:socket.color});
              if(config.seeMsgs)console.log('['+displayDate()+'] '+socket.pseudo+': '+message);
            }
            else{
              socket.emit('message', {pseudo:"SERVER",message:"Merci de patienter 2s entre chaque message",color:config.color});
            }
          }
          if(messages.length > config.maxLastMsgs){
            messages.shift();
          }
        }
    });
    socket.on('disconnect', function(){
      var clientid = this.id;
      var found = false;
      for(var i=0; i<clients.length; i++){
        if(clients[i].id == clientid){
          found = true;
          console.log(clients[i].pseudo+" déconnecté");
          clients.splice(i,1);
          io.emit('clients',clients);
        }
      }
      if(!found){
        console.log("Client non trouvé");
      }
    });
});

function displayDate() {
  var d = new Date();
  var h = d.getHours();
  var m = d.getMinutes();
  var s = d.getSeconds();
  if(h<10)h='0'+h;
  if(m<10)m='0'+m;
  if(s<10)s='0'+s;
  return (h+":"+m+":"+s);
}


server.listen(config.PORT);
LAUNCH();
