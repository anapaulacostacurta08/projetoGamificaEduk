var User = getUser();
var user_UID = sessionStorage.userUid;
getProfile();


var boardgames = getBoardgames();
// Verificar se o usuário tem acesso a funcionalidade
isAcessoBoargames();

firebase.auth().onAuthStateChanged( (user) => {
  if (!user) {
    sessionStorage.clear;
    window.location.href = "../login/login.html";
  }
})

// Captura o evento de envio do formulário
document.getElementById("boardgame-form").addEventListener("submit", function(event) {
  event.preventDefault();
 
  var alert_sucesso = document.getElementById("alert_sucesso");
  var alert_error = document.getElementById("alert_error");
  var msg_sucesso = document.getElementById("res_sucesso");
  var msg_error = document.getElementById("res_error");  

  // Captura os dados do formulário
  const round_date = (new Date()).toLocaleDateString('pt-BR');
  const level = document.getElementById("level").value;
  const host = sessionStorage.userUid;
  const boardgameid = document.getElementById("boardgameid").value;
  const state = "waiting"; // "waiting", "started", "finished"

  // Cria o objeto para salvar o quiz
  const newboardgame = {
    round_date,
    boardgameid,
    level,
    host,
    state,  
  };

  var existe;
  if (boardgames === undefined){
    getBoardgames();
  }
  existe = getBoardgamebyID(boardgameid,round_date, host, level);
  if(existe === "indisponível"){
      msg_error.innerHTML= "Funcionalidade indisponível. Limpe a página e Tente novamente!"; 
      alert_error.classList.add("show");
      return[];
  }else{
    if(existe =="sim"){
      msg_error.innerHTML="Rodada ID: "+ boardgameid + " está já esta cadastrado. Limpe a pagina e digite os dados novamente!"; 
      alert_error.classList.add("show");
      return[];
    }else{
      //Inserir
      saveBoardgame(newboardgame);
      msg_sucesso.innerHTML= "Consulte o cadastro da Rodada ID:"+ boardgameid+"!";
      alert_sucesso.classList.add("show");
      return[];
    }
  }
})

function recarregarAPagina(){
  window.location.reload();
} 

function logout() {
  firebase.auth().signOut().then(() => {
      sessionStorage.clear();
      window.location.href = "../../login/login.html";
  }).catch(() => {
      alert('Erro ao fazer logout');
  })
}

function voltar(){
  window.location.href = "../../home/home.html";
}


function saveBoardgame(newboardgame){
  boardgamesService.save(newboardgame);
  setBoardGames();
}

function getBoardgameRounds(boardgameid,round_date, host, level){
  var existe = "não";
  if(boardgames === undefined){
    existe = "indisponível";
  }else{
    boardgames.forEach(boardgame =>{
      let boardgame_dados = boardgame.dados;
      if(boardgame_dados.boardgameid == boardgameid){
        if(boardgame_dados.round_date == round_date){
          if(boardgame_dados.host == host){
            if(boardgame_dados.level == level){
              if(boardgame_dados.state !== "finished"){
                existe= "sim";
              }
            }
          }
        }
      }
    });
  }
  return existe;
}

function setBoardGames(){
  boardgamesService.findAll().then(boardgames =>{
      let boardgamesString = JSON.stringify(boardgames);
      sessionStorage.setItem('boardgames', boardgamesString);
    });
}

function getBoardgames(){
  let boardgamesString = sessionStorage.boardgames;
  let boardgames;
  if (boardgamesString === undefined){
    setBoardGames();
  }else{
    boardgames = JSON.parse(boardgamesString);
  }
  return boardgames;
}


function isAcessoBoargames(){
  var user_UID = sessionStorage.userUid;
  var perfil_professor = sessionStorage.professor;
  if ( (perfil_professor) && !(user_UID === undefined)){
    return true;
  }else{
    return false;
  }
}
  

function getUser(){
  let UserString = sessionStorage.User;
  let User = JSON.parse(UserString);
  console.log(User);
  return User;
}

function getProfile(){
  if(User === undefined){
      User = getUser();
  }
  document.getElementById("nameUser").innerHTML = User.name;
  document.getElementById("score_total").innerHTML = User.score +" points";
}