firebase.auth().onAuthStateChanged( (user) => {
  if (!user) {
      sessionStorage.clear;
      window.location.href = "../login/login.html";
  }
})

var user_UID = sessionStorage.userUid;
var data_today = (new Date()).toLocaleDateString('pt-BR');
var User = getUser();
getProfile();
var boardgames = getBoardgamesToday();


// Captura o evento de envio do formulário
document.getElementById("play-form").addEventListener("submit", function(event) {
  event.preventDefault();
  // Captura os dados do formulário
  const rodada_id = document.getElementById("boardgameid").value;
  var boardgame = getBoardgame(rodada_id);
  let boardgameid = boardgame.id;
  let boardgame_level = boardgame.dados.level;
  var players = boardgame.dados.players;
  let score = 0;
  if (players === undefined || players === "undefined"){
    players = new Array();
    players[0] = {user_UID:user_UID,score_round:score};
    boardgamesService.addPlayers(boardgameid, {players});
    buscarBoardgame(rodada_id); // atualizar o boardgame na sessão
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
      boardgamesService.addPlayers(boardgame_id, {players});
      buscarBoardgame(rodada_id); // atualizar o boardgame na sessão
    }

  }
  sessionStorage.setItem("score_round",score);
  sessionStorage.setItem("level",boardgame_level);
  window.location.href = "./menu.html";
});

function setBoardGame(boardgame){
  let boardgameString = JSON.stringify(boardgame);
  sessionStorage.setItem('boardgame', boardgameString);
  return boardgameString;
}

function buscarBoardgame(rodada_id){
  boardgamesService.getBoardGameByRodadaID(rodada_id).then((boardgames) => {
    boardgames.forEach(boardgame => {
      let boardgame_id = boardgame.dados.boardgameid;
      if(boardgame_id == rodada_id){
        return setBoardGame(boardgame);
      }
    })
  })
}

function getBoardgame(rodada_id){
  let tmp_boardgame = sessionStorage.boardgamesToday;
  if(!tmp_boardgame === undefined || !tmp_boardgame === "undefined"){
    boardgamesToday.forEach(boardgame => {
      if(boardgame.dados.boardgame_id == rodada_id){
        setBoardGame(boardgame);
        tmp_boardgame = boardgame;
      }
    })
  }else{
      boardgameString = buscarBoardgame(rodada_id);
      tmp_boardgame = JSON.parse(boardgameString);
      console.log(boardgame);
  }
  return tmp_boardgame;
}

function voltar(){
  window.location.href = "../home/home.html";
}

function logout() {
    firebase.auth().signOut().then(() => {
        sessionStorage.clear();
        window.location.href = "../login/login.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}

function getUser(){
  let UserString = sessionStorage.User;
  let User = JSON.parse(UserString);
  console.log(User);
  return User;
}

function getProfile(){
  if(User === undefined || User === "undefined"){
      User = getUser();
  }
  document.getElementById("nameUser").innerHTML = User.nickname;
  var avatar = User.avatar;
  document.getElementById("avatarUser").innerHTML ='<img class="img-fluid rounded-circle img-thumbnail" src="../../assets/img/perfil/'+avatar+'.png" width="50" height="50"></img>';
  document.getElementById("score_total").innerHTML = User.score;
}

function buscarBoardgamesToday(){
  boardgamesService.getBoardgamebyData(data_today).then(boardgames =>{
    return setBoardgamesToday(boardgames);
  })
}

function getBoardgamesToday(){
  let boardgamesString = sessionStorage.boardgamesToday;
  if(boardgamesString === undefined || boardgamesString === "undefined"){
      boardgamesString = buscarBoardgamesToday();
  }
  let boardgames = JSON.parse(boardgamesString);
  console.log(boardgames);
  return boardgames;
}

function setBoardgamesToday(boardgames){
  let boardgamesString = JSON.stringify(boardgames);
  sessionStorage.setItem('boardgamesToday', boardgamesString);
  return boardgamesString;
}