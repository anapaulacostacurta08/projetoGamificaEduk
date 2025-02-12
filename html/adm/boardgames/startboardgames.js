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

      const lista_activities = document.getElementById("lista_activities");
      const pesquisa_activities = document.getElementById("startactivity-form");
      const ativar_activity = document.getElementById("ativaractivity-form");
      ativar_activity.style.display = "none";

      // Captura o evento de envio do formulário
      document.getElementById("startactivity-form").addEventListener("submit", function(event) {
        event.preventDefault();
        // Captura os dados do formulário
        const activity_date = (new Date()).toLocaleDateString('pt-BR');
        const activity_level = document.getElementById("activity_level").value;
        const activity_teacher = User.uid;
        const activity_id = document.getElementById("activity_id").value;
        const activity_state = "waiting"; // "waiting", "started", "finished"

        let linhas = ''; 
        boardgamesService.getBoardGameByDados(activity_id, activity_date, activity_teacher, activity_level, activity_state).then(activities => {
          activities.forEach(activity => {
                  var activity_uid = activity.uid;
                  var activity_dados = activity.dados;
                  var option = activity_uid;
                  let linha_id = '<td><span>'+'<label class="form-check-label" for="'+activity_dados.activity_id+'">'+activity_dados.activity_id+'</span></label></td>';
                  let level = '<td><span>'+activity_dados.activity_level+'</span></td>';
                  let date = '<td><span>'+activity_dados.activity_date+'</span></td>';
                  let state = '<td><span>'+activity_dados.activity_state+'</span></td>';
                  let radio = '<td><input type="radio" class="form-check-activate" id="radio_id" name="radio_id" value="'+option+'" checked"></td>';
                  linhas = linhas + '<tr>'+radio+linha_id+level+date+state+'</tr>';
              })
              let tbody = '<tbody>'+linhas+'</tbody>';
              let thead = '<thead><tr><th></th><th>Rodada ID</th><th>Level</th><th>Data</th><th>Status</th></tr></thead>';     
              let table = '<table class="table table-hover" align="center">'+ thead + tbody+'</table>';
              lista_activities.innerHTML = table;
              pesquisa_activities.style.display = "none";
              ativar_activity.style.display = "inline";
          }).catch((error) => {
              let errorString = '<span>'+ error+'<span>';
              lista_boardgames.innerHTML = errorString;
        });  
      });

      document.getElementById("ativaractivity-form").addEventListener("submit", function(event) {
        event.preventDefault();
          let userselect = document.querySelector('input[name="radio_id"]:checked').value;
          let activities = {activity_state: "started"};
          var alert_sucesso = document.getElementById("alert_sucesso");
          var alert_error = document.getElementById("alert_error");
          var msg_sucesso = document.getElementById("res_sucesso");
          var msg_error = document.getElementById("res_error");  
      
          boardgamesService.update(userselect, activities).then(() => {
            msg_sucesso.innerHTML= "Atividade Iniciada com sucesso!";
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
