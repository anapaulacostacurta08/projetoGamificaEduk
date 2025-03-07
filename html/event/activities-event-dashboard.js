firebase.auth().onAuthStateChanged((User) => {
  if (User) {
    var players;
    let active_activities_list = document.getElementById("active_activities_list");
    let closed_activities_list = document.getElementById("closed_activities_list");
    const params = new URLSearchParams(window.location.search);
    var event_uid = params.get('event_uid');
    var event_state = params.get('state');

    if (event_state === "started"){
      activityService.getActivitybyEventID(event_uid).then((activities) => {
        let card_active_activity = ``;
        let card_closed_activity = ``;
        activities.forEach(activity => {
          players = activity.dados.players;
          let card_activity = `<span class="activity_dados" id="${activity.uid}">${activity.dados.name}</span>`;
          players.forEach(player => {
              let date_start = `<span id="data_time_start">${activity.dados.date_start} - ${activity.dados.time_start}</span>`;
              let date_final = `<span id="date_time_final">${activity.dados.date_final} - ${activity.dados.time_final}</span>`;
              let card_points = ``;
              if(player.user_UID === User.uid){
                card_points = `<span id="ponts" class="col-sm-4">`+
                `<span class="badge rounded-pill bg-info border border-2 border-dark p-1 m-1">`+
                    `<span id="score" class="badge bg-light text-dark border border-2 border-dark">${player.score}</span>&nbsp;PONTOS`+
                `</span>`+
              `</span>`;
              if(activity.dados.state === "started"){
                card_active_activity = card_active_activity +`<div class="card card_active">${card_activity}${date_start}${date_final}${card_points}</div>`;
              }
              if (activity.dados.state === "finished"){
                card_closed_activity = card_closed_activity +`<div class="card card_closed>${card_activity}${date_start}${date_final}${card_points}</div>`;
              }
            }           
          })
        })
        active_activities_list.innerHTML = card_active_activity;
        closed_activities_list.innerHTML = card_closed_activity;
        const card_active = active_activities_list.querySelectorAll(".card_active");
        const card_closed = closed_activities_list.querySelectorAll(".card_closed");

        // set onclick attribute to all available cards active
        for (i = 0; i < card_active.length; i++) {
          card_active[i].setAttribute("onclick", "cardActiveSelected(this)");
        }
          // set onclick attribute to all available cards closed
        for (i = 0; i < card_closed.length; i++) {
          card_closed[i].setAttribute("onclick", "cardClosedSelected(this)");
        }
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
  }
})