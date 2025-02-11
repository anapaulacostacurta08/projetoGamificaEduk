firebase.auth().onAuthStateChanged( (User) => {
    if (!User) {
        sessionStorage.clear;
        window.location.href = "../login/login.html";
    }else{
        userService.findByUid(User.uid).then(user=>{
            document.getElementById("nameUser").innerHTML = user.nickname;
            var avatar = user.avatar;
            document.getElementById("avatarUser").innerHTML ='<img class="img-fluid rounded-circle img-thumbnail" src="../../assets/img/perfil/'+avatar+'.png" width="50" height="50"></img>';
            document.getElementById("score_total").innerHTML = user.score;
          }).catch(error => {
              console.log(error);
          });
          const params = new URLSearchParams(window.location.search);
          const category = params.get('category');
          var boardgameid;
          var players;
          var count=0;
          var tokens_quiz_used;
          var tokens_quiz;
          boardgamesService.getBoardgamebyPlayer(User.uid, (new Date()).toLocaleDateString('pt-BR')).then((boardgames) => {
            boardgames.forEach(boardgame => {
              boardgameid = boardgame.id;
              players = boardgame.dados.players;
              players.forEach(player => {
                count++;
                if(player.user_UID == User.uid){
                    tokens_quiz_used = player.usedtokens_quiz;
                    document.getElementById("score_round").innerHTML = player.score_round;
                    document.getElementById("level").innerHTML = boardgame.dados.level;
                }
              });
            });
          });
          count = count-1;

          tokenService.getTokens().then(tokens => {
                tokens.forEach(token => {
                    tokens_quiz = token.quiz;
                });
            });

          document.getElementById("play-form").addEventListener("submit", function(event) {
            event.preventDefault();
            // Captura os dados do formulário
            let tokenid = document.getElementById("tokenid").value;
        
                if(category == "quiz"){
                    let pos_token = tokens_quiz.indexOf(tokenid);
                    if(!(tokens_quiz_used === "undefined") || !(tokens_quiz_used === undefined)){
                            if(pos_token > -1){
                                tokens_quiz_used = new Array();
                                tokens_quiz_used.push(tokenid);
                                players[count].push(tokens_quiz_used);
                                boardgamesService.addPlayers(boardgameid, {players});
                                alert("Token Válido!");        
                                window.location.href = "../quiz/quiz.html";
                            }else{
                                alert("Token inválido!");
                                window.location.href = "../../play/menu.html";
                            }
                    }else{    
                        let pos_token_used = tokens_quiz_used.indexOf(tokenid);  
                        let pos_token = tokens_quiz.indexOf(tokenid); 
                        if (pos_token_used > -1){ // Não foi usado  ainda
                            if(pos_token > -1){
                                tokens_quiz_used.push(tokenid);
                                players[count].push(tokens_quiz_used);
                                boardgamesService.addPlayers(boardgameid, {players});
                                alert("Token Válido!");        
                                window.location.href = "../quiz/quiz.html";
                            }else{
                                alert("Token inválido!");
                                window.location.href = "../../play/menu.html";
                            }
                        }
                    }
                    boardgamesService.addPlayers(boardgameid, {players});     
                }
                if(category == "challange"){
                    window.location.href = "../challange/challange.html";
                }
                if(category == "luck"){
                    window.location.href = "../luck/luck.html";
                }
                if(category == "quiz_final"){
                    window.location.href = "../final/final.html";
                }
        });
    }
});


function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../../home/home.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}    
  
function voltar(){
window.location.href = "../../play/menu.html";
}
