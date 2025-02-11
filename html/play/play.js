firebase.auth().onAuthStateChanged((User) => {
  if (!User) {
      window.location.href = "../login/login.html";
  }else{
    userService.findByUid(User.uid).then(user=>{
      document.getElementById("nameUser").innerHTML = user.nickname;
      //var user_UID = User.uid;
      var avatar = user.avatar;
      document.getElementById("avatarUser").innerHTML ='<img class="img-fluid rounded-circle img-thumbnail" src="../../assets/img/perfil/'+avatar+'.png" width="50" height="50"></img>';
      document.getElementById("score_total").innerHTML = user.score;
    }).catch(error => {
        console.log(error);
    });

    document.getElementById("play-form").addEventListener("submit", function(event) {
      event.preventDefault();
      // Captura os dados do formulário
      let rodada_id = document.getElementById("boardgameid").value;
      let boardgame_level;
      let boardgame_id; // id do tabuleiro fisico
      let boardgameid; // UID do doc no firestone
      let score = 0;
      boardgamesService.getBoardGameByRodadaID(rodada_id).then((boardgames) => {
        boardgames.forEach(boardgame => {
          boardgame_id = boardgame.dados.boardgameid;
          if(boardgame_id == rodada_id){
            boardgameid = boardgame.id; // UID do doc no firestone
            boardgame_level = boardgame.dados.level;
            var players = boardgame.dados.players;
            if (players === undefined){
              players = new Array();
              players[0] = {user_UID:User.uid,score_round:score};
              boardgamesService.addPlayers(boardgameid, {players});
            }else{
              //variável para verficar se o jogador já entrou no tabuleiro
              let isOnPlayer = false;
              players.forEach(player => {
                if(player.user_UID == User.uid){
                  isOnPlayer = true;
                  score = player.score_round;
                }
              });
              if (isOnPlayer){
                alert('Retornando para o Jogo!');
              }else{
                players.push({user_UID:User.uid,score_round:0});
                boardgamesService.addPlayers(boardgameid, {players});
              }
            }
          }
        });
        window.location.href = "./menu.html?score_round="+score+"&level="+boardgame_level+"&boardgameid="+boardgameid;
      });
    });
  }
});

function voltar(){
  window.location.href = "../home/home.html";
}

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../login/login.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}
