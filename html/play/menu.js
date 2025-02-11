//getProfile();
//var quiz = getAtualQuiz();
firebase.auth().onAuthStateChanged((User) => {
  if (!User) {
      window.location.href = "../login/login.html";
  }else{
    //var boardgameid;
    userService.findByUid(User.uid).then(user=>{
      document.getElementById("nameUser").innerHTML = user.nickname;
      var avatar = user.avatar;
      document.getElementById("avatarUser").innerHTML ='<img class="img-fluid rounded-circle img-thumbnail" src="../../assets/img/perfil/'+avatar+'.png" width="50" height="50"></img>';
      document.getElementById("score_total").innerHTML = user.score;
      //menu.html?score_round=0&level=1&boardgame_id=A02
      boardgamesService.getBoardgamebyPlayer(User.uid, (new Date()).toLocaleDateString('pt-BR')).then((boardgames) => {
        boardgames.forEach(boardgame => {
          var players = boardgame.dados.players;
          players.forEach(player => {
            if(player.user_UID == User.uid){
              //const params = new URLSearchParams(window.location.search);
              //const score_round = params.get('score_round');
              //boardgameid = params.get('boardgameid');
              //const level = params.get('level');
              document.getElementById("score_round").innerHTML = player.score_round;
              document.getElementById("level").innerHTML = boardgame.dados.level;
            }
          });
        });
      });
    }).catch(error => {
        console.log(error);
    });

    /** 
    boardgamesService.findByUid(boardgameid).then((boardgames) => {
        boardgames.forEach(boardgame => {
          let boardgame_id = boardgame.dados.boardgameid;
        });
      });
    */
    
  } 
});

function btnQuiz() {
  window.location.href = "../question/token/token.html?category=quiz&boardgame_id="+boardgameid;
}

function btnDesafio() {
  window.location.href = "../question/token/token.html?category=challange&boardgame_id="+boardgameid;
}

function btnSorte() {
  window.location.href = "../question/token/token.html?category=luck&boardgame_id="+boardgameid;
}

function btnExtra(){
  window.location.href = "../extra/extra.html?category=extra&boardgame_id="+boardgameid;
}

function btnQuizfinal(){
  window.location.href = "../question/token/token.html?category=quizfinal&boardgame_id="+boardgameid;;
}

function logout() {
  firebase.auth().signOut().then(() => {
      window.location.href = "../home/home.html";
  }).catch(() => {
      alert('Erro ao fazer logout');
  })
}

function btnVoltar(){
  window.location.href = "../home/home.html";
}
