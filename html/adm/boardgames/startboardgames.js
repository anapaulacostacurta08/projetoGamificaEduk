firebase.auth().onAuthStateChanged((User) => {
  if (!User) {
      window.location.href = "../login/login.html";
  }else{
      userService.findByUid(User.uid).then(user=>{
        document.getElementById("nameUser").innerHTML = user.nickname;
        var avatar = user.avatar;
        document.getElementById("avatarUser").innerHTML ='<img class="img-fluid rounded-circle img-thumbnail" src="../../assets/img/perfil/'+avatar+'.png" width="50" height="50"></img>';
      }).catch(error => {
          console.log(error);
      });

      const lista_boardgames = document.getElementById("lista_boardgames");
      const pesquisa_boardgames = document.getElementById("startboardgame-form");
      const ativar_boardgames = document.getElementById("ativarboardgame-form");
      ativar_boardgames.style.display = "none";

      // Captura o evento de envio do formulário
      document.getElementById("startboardgame-form").addEventListener("submit", function(event) {
        event.preventDefault();
        // Captura os dados do formulário
        const round_date = (new Date()).toLocaleDateString('pt-BR');
        const level = document.getElementById("level").value;
        const professor = User.uid;
        const boardgameid = document.getElementById("boardgameid").value;
        const state = "waiting"; // "waiting", "started", "finished"

        let linhas = ''; 
        boardgamesService.getBoardGameByDados(boardgameid, round_date, professor, level, state).then(boardgames => {
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
            document.getElementById("ativar").disabled = true;
          }).catch((error) => {
            msg_error.innerHTML= error;
            alert_error.classList.add("show");
          });
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
  window.location.href = "../../home/home.html";
}
