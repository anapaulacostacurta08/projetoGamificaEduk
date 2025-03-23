firebase.auth().onAuthStateChanged((User) => {
  if (User) {
    var players;
    var player;
    let linhas = ''; 
    const my_activities = document.getElementById("my_activities");
    
    activityService.getActivitybyPlayer(User.uid).then((activities) => {
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
      let points = 0;
      let user_UID = User.uid;
      let ckeck_in = {date: (new Date()).toLocaleDateString('pt-BR'), time: (new Date()).toLocaleTimeString('pt-BR')};
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
                          points = tmp_players[i].points;
                          alert('Retornando para o Jogo!');
                          window.location.href = "./menu.html?activity_uid="+activity_uid;
                        }else{
                          let quiz_answered = new Array();
                          let atual_quiz_answered = tmp_players[i].user_answered.quiz.questions;
                          for (j=0; i<atual_quiz_answered.length;j++){
                            quiz_answered[j] = atual_quiz_answered[j];
                          }
                          let tokens_quiz_used = new Array();
                          let atual_tokens_quiz_used = tmp_players[i].user_answered.quiz.tokens_used;
                          for (j=0; i<atual_tokens_quiz_used.length;j++){
                            tokens_quiz_used[j] = atual_tokens_quiz_used[j];
                          }
                          let user_UID = tmp_players[i].user_UID;
                          let points = tmp_players[i].points;
                          let timestamp = tmp_players[i].timestamp;
                          let check_in = {date:tmp_players[i].ckeck_in.date, time: tmp_players[i].ckeck_in.time};
                          let check_out = {date: tmp_players[i].ckeck_out.date, time: tmp_players[i].ckeck_out.time};
                         
                          let bonus_answered = new Array();
                          let atual_bonus_answered =  tmp_players[i].user_answered.bonus.questions;
                          for (j=0; i<atual_bonus_answered.length;j++){
                            bonus_answered[j] = atual_bonus_answered[j];
                          }
                          let tokens_bonus_used = new Array();
                          let atual_tokens_bonus_used = tmp_players[i].user_answered.bonus.tokens_used;
                          for (j=0; i<atual_tokens_bonus_used.length;j++){
                            tokens_bonus_used[j] = atual_tokens_bonus_used[j];
                          }

                          let luck_answered = new Array();
                          let atual_luck_answered =  tmp_players[i].user_answered.luck.questions;
                          for (j=0; i<atual_luck_answered.length;j++){
                            luck_answered[j] = atual_luck_answered[j];
                          }
                          let tokens_luck_used = new Array();
                          let atual_tokens_luck_used = tmp_players[i].user_answered.luck.tokens_used;
                          for (j=0; i<atual_tokens_luck_used.length;j++){
                            tokens_luck_used[j] = atual_tokens_luck_used[j];
                          }
                          let challange_answered = new Array();
                          let atual_challange_answered =  tmp_players[i].user_answered.challange.questions;
                          for (j=0; i<atual_challange_answered.length;j++){
                            challange_answered[j] = atual_challange_answered[j];
                          }
                          let tokens_challange_used = new Array();
                          let atual_tokens_challange_used = tmp_players[i].user_answered.challange.tokens_used;
                          for (j=0; i<atual_tokens_challange_used.length;j++){
                            tokens_challange_used[j] = atual_tokens_challange_used[j];
                          }
                          let quiz_final_answered = new Array();
                          let atual_quiz_final_answered =  tmp_players[i].user_answered.quiz_final.questions;
                          for (j=0; i<atual_quiz_final_answered.length;j++){
                            quiz_final_answered[j] = atual_quiz_final_answered[j];
                          }
                          let tokens_quiz_final_used = new Array();
                          let atual_tokens_quiz_final_used = tmp_players[i].user_answered.quiz_final.tokens_used;
                          for (j=0; i<atual_tokens_quiz_final_used.length;j++){
                            tokens_quiz_final_used[j] = atual_tokens_quiz_final_used[j];
                          }
                          let bonus = {questions:bonus_answered,tokens_used:tokens_bonus_used};
                          let quiz = {questions:quiz_answered,tokens_used:tokens_quiz_used};
                          let luck = {questions:luck_answered,tokens_used:tokens_luck_used};
                          let challange = {questions: challange_answered,tokens_used:tokens_challange_used};
                          let quiz_final = {questions:quiz_final_answered,tokens_used:tokens_quiz_final_used};
                          let user_answered = {bonus, quiz,luck, challange,quiz_final};
                          players[i] = {user_UID,points,check_in, check_out, timestamp,user_answered};
                        }
                      }
                      let user_answered = [];
                      let check_out = {date:"",time:""};
                      players[last] = {user_UID,points,ckeck_in,check_out,timestamp,user_answered};
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
