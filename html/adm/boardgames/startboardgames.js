var user_UID = sessionStorage.userUid;
var User = getUser();
getProfile();

var lista_boardgames = document.getElementById("lista_boardgames");
var pesquisa_boardgames = document.getElementById("startboardgame-form");
var ativar_boardgames = document.getElementById("ativarboardgame-form");
ativar_boardgames.style.display = "none";

firebase.auth().onAuthStateChanged( (user) => {
  if (!user) {
    sessionStorage.clear;
    window.location.href = "../login/login.html";
  }
})

// Captura o evento de envio do formulário
document.getElementById("startboardgame-form").addEventListener("submit", function(event) {
  event.preventDefault();

  // Captura os dados do formulário
  const round_date = (new Date()).toLocaleDateString('pt-BR');
  const level = document.getElementById("level").value;
  const professor = sessionStorage.userUid;
  const boardgameid = document.getElementById("boardgameid").value;
  const state = "waiting"; // "waiting", "started", "finished"

  let linhas = ''; 
  boardgamesService.getBoardGameByDados(boardgameid, round_date, professor, level, state).then(boardgames => {
    setBoardGames(boardgames);
    boardgames.forEach(boardgame => {
            var boardgame_id = boardgame.id;
            var boardgame_dados = boardgame.dados;
            var option = boardgame_id;
            let round_id = '<td><span>'+'<label class="form-check-label" for="'+boardgame_dados.boardgameid+'">'+boardgame_dados.boardgameid+'</span></label></td>';
            let level = '<td><span>'+boardgame_dados.level+'</span></td>';
            let round_data = '<td><span>'+boardgame_dados.round_date+'</span></td>';
            let state = '<td><span>'+boardgame_dados.state+'</span></td>';
            let radio = '<td><input type="radio" class="form-check-activate" id="radio_id" name="radio_id" value="'+option+'" checked"></td>';
            linhas = linhas + '<tr>'+radio+round_id+level+round_data+state+'</tr>';
        })
        let tbody = '<tbody>'+linhas+'</tbody>';
        let thead = '<thead><tr><th></th><th>Rodada ID</th><th>Level</th><th>Data</th><th>Status</th></tr></thead>';     
        let table = '<table class="table table-hover" align="center">'+ thead + tbody+'</table>';
        lista_boardgames.innerHTML = table;
        pesquisa_boardgames.style.display = "none";
        ativar_boardgames.style.display = "inline";
    }).catch((error) => {
        let errorString = '<span>'+ error+'<span>';
        lista_boardgames.innerHTML = errorString;
  });  
});

function logout() {
  firebase.auth().signOut().then(() => {
      sessionStorage.clear();
      window.location.href = "../../home/home.html";
  }).catch(() => {
      alert('Erro ao fazer logout');
  })
}

function voltar(){
  sessionStorage.removeItem('boardgames');
  window.location.href = "../../home/home.html";
}

function limpar(){
  sessionStorage.removeItem('boardgames');
  window.location.reload();
}

document.getElementById("ativarboardgame-form").addEventListener("submit", function(event) {
  event.preventDefault();
    let userselect = document.querySelector('input[name="radio_id"]:checked').value;
    var boardgames = {state: "started"};

    var alert_sucesso = document.getElementById("alert_sucesso");
    var alert_error = document.getElementById("alert_error");
    var msg_sucesso = document.getElementById("res_sucesso");
    var msg_error = document.getElementById("res_error");  

    boardgamesService.update(userselect, boardgames).then(() => {
      msg_sucesso.innerHTML= "Iniciada Rodada com sucesso!";
      alert_sucesso.classList.add("show");
    }).catch((error) => {
      msg_error.innerHTML= error;
      alert_error.classList.add("show");
    });
});

function setBoardGames(boardgames){
  let boardgamesString = JSON.stringify(boardgames);
  sessionStorage.setItem('boardgames', boardgamesString);
}

function getBoardgames(){
  let boardgamesString = sessionStorage.boardgames;
  let boardgames;
  boardgames = JSON.parse(boardgamesString);
  return boardgames;
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