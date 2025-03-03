firebase.auth().onAuthStateChanged((User) => {
  if (User) {
    var alert_sucesso = document.getElementById("alert_sucesso");
    var alert_error = document.getElementById("alert_error");
    var msg_sucesso = document.getElementById("res_sucesso");
    var msg_error = document.getElementById("res_error");  

    document.getElementById("play-form").addEventListener("submit", function(event) {
      event.preventDefault();
      // Captura os dados do formulário
      let id = document.getElementById("activity_id").value;
      let activity_uid; // UID do doc no firestone
      let score = 0;
      let user_UID = User.uid;
      let ckeckin_date = (new Date()).toLocaleDateString('pt-BR');
      let ckeckin_time = (new Date()).toLocaleTimeString('pt-BR');
      let timestamp = new Date().getTime();

      activityService.getActivities(id).then((activities) => {
        activities.forEach(activity => {
          if(activity.dados.id == id){

            let data_start = event.dados.date_start.split("/");
            let time_start = event.dados.time_start.split(":");
            let data_time_start = new Date(data_start[2],data_start[1]-1,data_start[0],time_start[0],time_start[1]);
            let data_final = event.dados.date_final.split("/");
            let time_final = event.dados.time_final.split(":");
            let data_time_final = new Date(data_final[2],data_final[1]-1,data_final[0],time_final[0],time_final[1]);

            if(date >= data_time_start &&  date <= data_time_final){
                  activity_uid = activity.uid; // UID do doc no firestone
                    var players = new Array();
                    var tmp_players = activity.dados.players;
                    var last = tmp_players.length;
                    for(i=0;i<last;i++){
                      if(tmp_players[i].user_UID == user_UID){
                        score = tmp_players[i].score;
                        alert('Retornando para o Jogo!');
                        window.location.href = "./menu.html?activity_uid="+activity_uid;
                      }else{
                        let quiz_answered = new Array();
                        let atual_quiz_answered = tmp_players[i].quiz_answered;
                        for (j=0; i<atual_quiz_answered.length;j++){
                          quiz_answered[j] = atual_quiz_answered[j];
                        }
                        let tokens_quiz_used = new Array();
                        let atual_tokens_quiz_used = tokens_quiz_used;
                        for (j=0; i<atual_tokens_quiz_used.length;j++){
                          tokens_quiz_used[j] = atual_tokens_quiz_used[j];
                        }
                        let user_UID = tmp_players[i].user_UID;
                        let score = tmp_players[i].score;
                        let ckeckin_date = tmp_players[i].ckeckin_date;
                        let ckeckin_time = tmp_players[i].ckeckin_time;
                        let timestamp = tmp_players[i].timestamp;
                        players[i] = {user_UID,score,ckeckin_date,ckeckin_time, timestamp,quiz_answered,tokens_quiz_used};
                      }
                    }
                    let quiz_answered = [];
                    let tokens_quiz_used = [];
                    players[last] = {user_UID,score,ckeckin_date,ckeckin_time,timestamp,quiz_answered,tokens_quiz_used};
                    activityService.update(activity_uid, {players}).then(window.location.href = "./menu.html?activity_uid="+activity_uid);
            
            }else{
              alert("Atividade fora do prazo!");
            }
          }else{
            alert("Atividade Não encontrada!");
          }  
        });
      }).catch((error) => {
        alert(error.menssage);
      })
    })
    
  }
});

function refresh(){
  location.reload();
}