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

      document.getElementById("boardgame-form").addEventListener("submit", function(event) {
        event.preventDefault();
       
        var alert_sucesso = document.getElementById("alert_sucesso");
        var alert_error = document.getElementById("alert_error");
        var msg_sucesso = document.getElementById("res_sucesso");
        var msg_error = document.getElementById("res_error");  
      
        // Captura os dados do formulário
        const round_date = (new Date()).toLocaleDateString('pt-BR');
        const level = document.getElementById("level").value;
        const host = User.uid;
        const boardgameid = document.getElementById("boardgameid").value;
        const state = "waiting"; // "waiting", "started", "finished"
      
        
        boardgamesService.getBoardGameByRodadaID(boardgameid).then(boardgames=>{
          boardgames.forEach(boardgame=>{
            msg_error.innerHTML= "Rodada: "+boardgame.dados.boardgameid+" já cadastrada!";
            alert_error.classList.add("show");
          })
        }).catch(error => {
              if(error == "Não encontrado"){
                console.log(error);
              }
        });

        // Cria o objeto para salvar o quiz
        const newboardgame = {
          round_date,
          boardgameid,
          level,
          host,
          state,  
        };
        try{
          boardgamesService.save(newboardgame);
          msg_sucesso.innerHTML= "Iniciada Cadastrada com Sucesso!";
          alert_sucesso.classList.add("show");
          document.getElementById("bt-success").disabled = true;
        } catch (error){
          msg_error.innerHTML= "Rodada: "+boardgame.dados.boardgameid+" já cadastrada!";
          alert_error.classList.add("show");
        }
    });
  }
})
 
function logout() {
  firebase.auth().signOut().then(() => {
      window.location.href = "../../login/login.html";
  }).catch(() => {
      alert('Erro ao fazer logout');
  })
}

function voltar(){
  window.location.href = "../../home/home.html";
}
