firebase.auth().onAuthStateChanged((User) => {
  if (User) {
    var alert_sucesso = document.getElementById("alert_sucesso");
    var alert_error = document.getElementById("alert_error");
    var msg_sucesso = document.getElementById("res_sucesso");
    var msg_error = document.getElementById("res_error");  

    document.getElementById("enroll-form").addEventListener("submit", function(event) {
      event.preventDefault();
      // Captura os dados do formulário
      let id = document.getElementById("event_id").value;
      let event_uid; // UID do doc no firestone
      let coins = 0;
      let user_UID = User.uid;
      let date = new Date();
      
      eventService.getEventsByID(id).then((events) => {
        events.forEach(event => {
          if(event.dados.id == id){
            let data_start = event.dados.date_start.split("/");
            let time_start = event.dados.time_start.split(":");
            let data_time_start = new Date(data_start[2],data_start[1]-1,data_start[0],time_start[0],time_start[1]);
            let data_final = event.dados.date_final.split("/");
            let time_final = event.dados.time_final.split(":");
            let data_time_final = new Date(data_final[2],data_final[1]-1,data_final[0],time_final[0],time_final[1]);

            if(date >= data_time_start &&  date <= data_time_final){
              event_uid = event.uid; // UID do doc no firestone
              enrollEventService.getEnrollsByEventUidUserUid(event_uid,user_UID).then(enroll_events => {
                if (!(enroll_events.length > 0)){
                  let event_id = event_uid;
                  let new_date = new Date();
                  let date = new_date.toLocaleDateString('pt-BR');
                  let time = new_date.toLocaleTimeString('pt-BR');
                  let enroll_events = {user_UID,coins,date,time,event_id};
                  enrollEventService.save(enroll_events);
                  msg_sucesso.innerHTML= "Inscrição no evento realizada com sucesso!";
                  alert_sucesso.classList.add("show");
                  document.getElementById("bt-success").disabled = true;
                }else{
                  msg_error.innerHTML= "Inscrição já foi realizada para este evento!";
                  alert_error.classList.add("show");
                  document.getElementById("bt-success").disabled = true;
                }
              })             
            }else{
               msg_error.innerHTML= "Evento fora do prazo!";
               alert_error.classList.add("show");
               document.getElementById("bt-success").disabled = true;
            }
          }else{
            msg_error.innerHTML= "Evento não encontrado!";
            alert_error.classList.add("show");
            document.getElementById("bt-success").disabled = true;
          }  
        });
      }).catch((error) => {
        msg_error.innerHTML= error.menssage;
        alert_error.classList.add("show");
        document.getElementById("bt-success").disabled = true;
      })
    })
    
  }
});
