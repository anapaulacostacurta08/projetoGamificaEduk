firebase.auth().onAuthStateChanged((User) => {
  if (User) {
      const lista_activities = document.getElementById("lista_activities");
      const pesquisa_activities = document.getElementById("start-activity-form");
      const ativar_activity = document.getElementById("ativate-activity-form");
      ativar_activity.style.display = "none";

      // Captura o evento de envio do formulário
      document.getElementById("start-activity-form").addEventListener("submit", function(event) {
        event.preventDefault();
        // Captura os dados do formulário
        const activity_date = new Date((document.getElementById("activity_date").value).replace('-','/')).toLocaleDateString('pt-BR');
        const activity_level = document.getElementById("activity_level").value;
        const activity_host = User.uid;
        const activity_id = document.getElementById("activity_id").value;
        const activity_state = "waiting"; // "waiting", "started", "finished"

        let linhas = ''; 
        activityService.getActivitiesbyDateStart(activity_id, activity_date, activity_host, activity_level, activity_state).then(activities => {
          activities.forEach(activity => {
                  var activity_uid = activity.uid;
                  var activity_dados = activity.dados;
                  var option = activity_uid;
                  let linha_id = '<td><span>'+'<label class="form-check-label" for="'+activity_dados.id+'">'+activity_dados.id+'</span></label></td>';
                  let date = '<td><span>'+activity_dados.date_start+'</span>-<span>'+activity_dados.time_start+'</span>-<span>'+activity_dados.date_final+'</span>-<span>'+activity_dados.time_final+'</span></td>';
                  let radio = '<td><input type="radio" class="form-check-activate" id="radio_id" name="radio_id" value="'+option+'" checked"></td>';
                  linhas = linhas + '<tr>'+radio+linha_id+date+'</tr>';
              })
              let tbody = '<tbody>'+linhas+'</tbody>';
              let thead = '<thead><tr><th></th><th>Atividade</th><th>Inicio</th></tr></thead>';     
              let table = '<table class="table table-hover" align="center">'+ thead + tbody+'</table>';
              lista_activities.innerHTML = table;
              pesquisa_activities.style.display = "none";
              ativar_activity.style.display = "inline";
          }).catch((error) => {
              let errorString = '<span>'+ error.message+'<span>';
              lista_activities.innerHTML = errorString;
        });  
      });

      document.getElementById("ativate-activity-form").addEventListener("submit", function(event) {
        event.preventDefault();
          let userselect = document.querySelector('input[name="radio_id"]:checked').value;
          let activities = {state: "started"};
          var alert_sucesso = document.getElementById("alert_sucesso");
          var alert_error = document.getElementById("alert_error");
          var msg_sucesso = document.getElementById("res_sucesso");
          var msg_error = document.getElementById("res_error");  
      
          activityService.update(userselect, activities).then(() => {
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

