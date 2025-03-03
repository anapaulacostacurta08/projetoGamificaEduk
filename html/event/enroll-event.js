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
      let ckeckin_date = (new Date()).toLocaleDateString('pt-BR');
      let ckeckin_time = (new Date()).toLocaleTimeString('pt-BR');
      let timestamp = new Date().getTime();

      eventService.getEventsByID(id).then((events) => {
        events.forEach(event => {
          if(event.dados.id == id){
            if(ckeckin_date >= event.dados.date_start &&  ckeckin_date <= event.dados.date_final){
              if( ckeckin_time >= event.dados.time_start && ckeckin_time <= event.dados.time_final){
                    event_uid = event.uid; // UID do doc no firestone
                    var players = new Array();
                    var tmp_players = event.dados.players;
                    var last = tmp_players.length;
                    for(i=0;i<last;i++){
                      if(tmp_players[i].user_UID == user_UID){
                        coins = tmp_players[i].coins;
                        //alert('Retornando para o Jogo!');
                        //window.location.href = "./menu.html?activity_uid="+activity_uid;
                      }else{
                        let user_UID = tmp_players[i].user_UID;
                        let coins = tmp_players[i].coins;
                        let ckeckin_date = tmp_players[i].ckeckin_date;
                        let ckeckin_time = tmp_players[i].ckeckin_time;
                        let timestamp = tmp_players[i].timestamp;
                        players[i] = {user_UID,coins,ckeckin_date,ckeckin_time, timestamp};
                      }
                    }
                    players[last] = {user_UID,coins,ckeckin_date,ckeckin_time,timestamp};
                    eventService.update(event_uid, {players});
                    msg_sucesso.innerHTML= "Inscrição realizada com Sucesso!";
                    alert_sucesso.classList.add("show");
                    document.getElementById("bt-success").disabled = true;
              }
            }else{
               msg_error.innerHTML= "Atividade fora do prazo!";
               alert_error.classList.add("show");
               document.getElementById("bt-success").disabled = true;
            }
          }else{
            msg_error.innerHTML= "Atividade Não encontrada!";
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
