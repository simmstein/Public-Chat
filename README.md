# Public-Chat
Public Chat is a simple chat made with NodeJS and Socket.io.


Documentation Public Chat
=========================

* * * * *

Côté Client:
------------

Si vous souhaitez intégrer Public Chat à votre site, vous allez avoir
besoin de certaines choses:

1.  Importez Jquery dans des balises script :
    http://code.jquery.com/jquery-1.10.1.min.js
2.  Importez socket.io dans des balises script :
    http://92.222.24.154:8080/socket.io/socket.io.js
3.  Importez Jquery UI dans des balises script :
    http://code.jquery.com/ui/1.11.4/jquery-ui.js
4.  Importez Public-Chat script dans des balises script:
    http://playandcode.ml/chat/chat.js

Maintenant, vous allez avoir besoin de certains conteneurs pour
accueillir votre chat:

-   Commencez par le Peudo\_wrapper, c'est ici que le client va entrer
    ses informations : Pseudo, IP, Port, Mot de passe:

                <div id="pseudo_wrapper" style="display:none;" class="row">
                  <input type="text" name="name" id="pseudo" placeholder="Pseudo (max. 15 char.)" class="four columns">
                  <input type="text" name="name" id="server" placeholder="IP" class="three columns" value="92.222.24.154">
                  <input type="text" name="name" id="port" placeholder="PORT" value="8080" class="two columns">
                  <input type="password" name="name" id="mdp" placeholder="MDP" class="two columns">
                  <button type="button" name="button" onclick="entered()" class="two columns">OK</button>
                </div>
              

    *Les classes ne sont pas obligatoires*

-   Ensuite, il va vous falloir une section dans laquelle vont
    s'afficher les clients:

                <div id="clients">
                  Serveur par defaut : 92.222.24.154:8080 -- Pas de mot de passe
                </div>
              

-   Il vous faut ensuite de quoi afficher les messages:

                  <div id="chat_content"></div>
              

-   Enfin, il vous faut un endroi où le client peut écrire son message:

                <div id="form-container" style="display:none;>
                    <form action="/" method="post" id="formulaire_chat">
                        <input type="text" name="message" id="message" placeholder="Message (Max. 150 charactÃ¨res)" autofocus autocomplete="off" onkeydown="countChar(this)" onkeyup="countChar(this)" />
                        <input type="submit" id="envoi_message" class="button-primary"/>
                        <span id="charNum"></span>
                    </form>
                  </div>
              

    *Les classes ne sont pas obligatoires*

Côté Serveur:
-------------

Si vous souhaitez héberger votre propre serveur Public-Chat, suivez les
instructions suivantes:

1.  Téléchargez le côté serveur : [Cliquez ici](#)
2.  Installez NodeJS sur votre machine (ordinateur ou serveur dédié)
3.  Ouvrez la console, naviguez vers l'emplacement où se trouve le
    fichier serveur
4.  Faites la commande `npm install` pour installer toutes les
    dépendances
5.  Ouvrez le fichier `app.js` et modifiez les valeurs de la variable
    `config` à votre guise:

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
              

6.  Lancez votre serveur en entrant la commande `node app.js`. Vous
    devriez avoir un affichage comme celui-ci:\

    ![](http://image.noelshack.com/fichiers/2015/47/1447683465-consoletrue.png)\
     Si vous obtenez une erreur, assurez-vous de bien avoir effectué la
    commande `npm install` auparavant. Voici un exemple d'erreur que
    vous pourriez obtenir :\

    ![](http://image.noelshack.com/fichiers/2015/47/1447683604-consolefalse.png)

