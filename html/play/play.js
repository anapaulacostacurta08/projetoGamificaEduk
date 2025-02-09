firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
      window.location.href = "../login/login.html";
  }else{
    userService.findByUid(user.uid).then(user=>{
      document.getElementById("nameUser").innerHTML = user.nickname;
      user_UID = user.uid;
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
      boardgamesService.getBoardGameByRodadaID(rodada_id).then((boardgames) => {
        boardgames.forEach(boardgame => {
          let boardgame_id = boardgame.dados.boardgameid;
          if(boardgame_id == rodada_id){
            let boardgameid = boardgame.id;
            let boardgame_level = boardgame.dados.level;
            var players = boardgame.dados.players;
            let score = 0;
            if (players === undefined){
              players = new Array();
              players[0] = {user_UID:user_UID,score_round:score};
              boardgamesService.addPlayers(boardgameid, {players});
            }else{
              //variável para verficar se o jogador já entrou no tabuleiro
              let isOnPlayer = false;
              players.forEach(player => {
                if(player.user_UID == user_UID){
                  isOnPlayer = true;
                  score = player.score_round;
                }
              });
              if (isOnPlayer){
                alert('Você já entrou no jogo!Retornando para o Jogo!');
              }else{
                players.push({user_UID:user_UID,score_round:0});
                boardgamesService.addPlayers(boardgameid, {players});
              }
            }
          }
        });
        //document.getElementById("score_round").innerHTML = score;
        //document.getElementById("level").innerHTML = boardgame_level;
        fetch("./menu.html", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ score_round: score, level: level, boardgame_id: boardgame_id })
        }).then(res => res.json())
          .then(data => console.log(data))
          .catch(error => console.error(error));
        //window.location.href = "./menu.html?score_round="+score";
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
