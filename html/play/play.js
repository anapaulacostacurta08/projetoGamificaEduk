firebase.auth().onAuthStateChanged((User) => {
  if (User) {
    const alert_error = document.getElementById("alert_error");
    const msg_error = document.getElementById("res_error");
    //var user_UID = User.uid;
    document.getElementById("play-form").addEventListener("submit", async function(event) {
      event.preventDefault();
      let activity_ID = document.getElementById("activity_id").value;
      try {
        await activityService.getActivities(activity_ID).then (activities => {
          var activity = validarAtivities(activities, activity_ID);
          if (validarValor(activity)){
            let activity_id = activity.uid;
            checkinactivityService.getcheckinbyPlayer(activity_id, User.uid).then(checkin_activities =>{
              var checkin_player = (checkin_activities.length === 1) ? checkin_activities[0] : null;
              if (validarValor(checkin_player)) {
                alert('Retornando para atividade!');
                menu(activity_id);
              } else {
                alert('Realizado check-in na atividade!');
                let new_date = new Date();
                let date = new_date.toLocaleDateString('pt-BR');
                let time = new_date.toLocaleTimeString('pt-BR');
                let points = 0;
                let user_UID = User.uid;
                const activities = {
                  activity_id,
                  date,
                  time,
                  points,
                  user_UID
                };
                try{
                  do{
                    var result = checkinactivityService.save(activities);              
                    console.log("aguardando finalizar o Checkin na atividade...");
                  }while(result.empty)
                  alert("Check-in na atividade finalizado! Encaminhando para o menu de tarefas...");
                  console.log(result);
                  menu();
                }catch(error){
                  alert(error.message);
                }; 
              }
             
            })
          } else {
            console.log("Atividade fora do prazo!");
          }
        })
      }catch (error) {
        alert("Erro: " + error.message);
        console.error(error);
      }
      
    });

      function menu(activity_id){
        window.location.href = "./menu.html?activity_id="+activity_id;
      }

      function validarValor(valor) {
        if (valor === null) {
          return false;
        }
        return true;
      }
   
      function validarAtivities(activities, activity_ID) {
          if (activities.length > 1) {
            alert("Verificar com o administrador do Evento a configuração da atividade");
            return null;
          }else{
            if (activities.length === 1) {
              const activity = activities[0].dados;
              if (activity.id === activity_ID) {
                let date = new Date();
                const [dStart, mStart, yStart] = activity.date_start.split("/");
                const [hStart, minStart] = activity.time_start.split(":");
                const data_time_start = new Date(yStart, mStart - 1, dStart, hStart, minStart);
      
                const [dEnd, mEnd, yEnd] = activity.date_final.split("/");
                const [hEnd, minEnd] = activity.time_final.split(":");
                const data_time_final = new Date(yEnd, mEnd - 1, dEnd, hEnd, minEnd);
      
                if (date >= data_time_start && date <= data_time_final) {
                  return activities[0];
                } else {
                  alert("Atividade fora do prazo!");
                }
              }
            }else{
              return null;
            }
          }
      }
  }
});