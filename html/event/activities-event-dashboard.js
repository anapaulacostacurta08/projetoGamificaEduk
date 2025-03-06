firebase.auth().onAuthStateChanged((User) => {
  if (User) {
    var players;
    var player;
    let linhas = ''; 
    const my_activities = document.getElementById("my_activities");
    const params = new URLSearchParams(window.location.search);
    var event_uid = params.get('event_uid');

    activityService.getActivitybyEventID(event_uid).then((activities) => {
      activities.forEach(activity => {
        players = activity.dados.players;
        player = players.find(player => player.user_UID == User.uid);                      
        var activity_uid = activity.uid;
        var activity_dados = activity.dados;
        let entrar;
        if (activity_dados.state =="started"){
          entrar = `<td><span><input type="radio" id="activity_uid" class="activity_uid" value="${activity_uid}">${activity_dados.id}</span></td>`;
        }else{
          entrar = `<td><span>&nbsp;&nbsp;&nbsp${activity_dados.id}</span></td>`;
        }
        let date = '<td><span>'+activity_dados.date_start+'</span>-<span>'+activity_dados.time_start+'</span>-<span>'+activity_dados.date_final+'</span>-<span>'+activity_dados.time_final+'</span></td>';
        let state = '<td><span>'+activity_dados.state+'</span></td>';
        linhas = linhas + '<tr>'+entrar+date+state+'</tr>';
      })
      let tbody = '<tbody>'+linhas+'</tbody>';
      let thead = '<thead><tr><th>Atividade</th><th>Período</th><th>Status</th></tr></thead>';     
      let table = '<table class="table table-hover" align="center">'+ thead + tbody+'</table>';
      my_activities.innerHTML = table;
    })

    document.getElementById("play-form").addEventListener("submit", function(event) {
      event.preventDefault();
      // Captura os dados do formulário
      let uid = my_activities.querySelector(".activity_uid").value;
      let score = 0;
      let user_UID = User.uid;
      let ckeckin_date = (new Date()).toLocaleDateString('pt-BR');
      let ckeckin_time = (new Date()).toLocaleTimeString('pt-BR');
      let timestamp = new Date().getTime();

      activityService.getActivitybyUid(uid).then((activity) => {
              let data_start = event.dados.date_start.split("/");
              let time_start = event.dados.time_start.split(":");
              let data_time_start = new Date(data_start[2],data_start[1]-1,data_start[0],time_start[0],time_start[1]);
              let data_final = event.dados.date_final.split("/");
              let time_final = event.dados.time_final.split(":");
              let data_time_final = new Date(data_final[2],data_final[1]-1,data_final[0],time_final[0],time_final[1]);

              if(date >= data_time_start &&  date <= data_time_final){
                    var activity_uid = activity.uid; // UID do doc no firestone
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
                msg_error.innerHTML= "Atividade fora do prazo!";
                alert_error.classList.add("show");
                document.getElementById("bt-success").disabled = true;
              }
      })
    })
  }
})