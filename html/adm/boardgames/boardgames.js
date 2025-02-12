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

      document.getElementById("activity-form").addEventListener("submit", function(event) {
        event.preventDefault();
       
        var alert_sucesso = document.getElementById("alert_sucesso");
        var alert_error = document.getElementById("alert_error");
        var msg_sucesso = document.getElementById("res_sucesso");
        var msg_error = document.getElementById("res_error");  
      
        // Captura os dados do formulário
        const activity_date_start = new Date(document.getElementById("activity_date_start").value).toLocaleDateString('pt-BR');
        const activity_date_final = new Date(document.getElementById("activity_date_start").value).toLocaleDateString('pt-BR');
        const activity_time_start = new Date(document.getElementById("activity_date_start").value).toLocaleDateString('pt-BR');
        const activity_time_final = new Date(document.getElementById("activity_date_start").value).toLocaleDateString('pt-BR');
        const activity_level = document.getElementById("activity_level").value;
        const activity_teacher = User.uid;
        const activity_id = document.getElementById("activity_id").value;
        const activity_state = "waiting"; // "waiting", "started", "finished"
      
        /** 
        boardgamesService.getBoardGameByRodadaID(boardgameid).then(boardgames=>{
          boardgames.forEach(boardgame=>{
            msg_error.innerHTML= "Atividade: "+boardgame.dados.boardgameid+" já cadastrada!";
          })
        }).catch(error => {
              if(error == "Não encontrado"){
                console.log(error);
              }
        });

        */
      
        // Cria o objeto para salvar o quiz
        const newactivity = {
          activity_date,
          activity_id,
          activity_level,
          activity_teacher,
          activity_state,  
        };
        try{
          boardgamesService.save(newactivity);
          msg_sucesso.innerHTML= "Atividade cadastrada com Sucesso!";
          alert_sucesso.classList.add("show");
          document.getElementById("bt-success").disabled = true;
        } catch (error){
          msg_error.innerHTML= error;
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
