firebase.auth().onAuthStateChanged((User) => {
  if (User) {
    var players;
    var player;
    let linhas = ''; 
    const eventos = document.getElementById("meus_eventos");
    
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
      eventos.innerHTML = table;
    })

    document.getElementById("play-form").addEventListener("submit", function(event) {
      event.preventDefault();
      // Captura os dados do formulário
      let uid = eventos.querySelector(".activity_uid").value;
      let score = 0;
      let user_UID = User.uid;
      let ckeckin_date = (new Date()).toLocaleDateString('pt-BR');
      let ckeckin_time = (new Date()).toLocaleTimeString('pt-BR');
      let timestamp = new Date().getTime();

      activityService.getActivitybyUid(uid).then((activity) => {
          if(ckeckin_date >= activity.date_start &&  ckeckin_date <= activity.date_final){
            if( ckeckin_time >= activity.time_start && ckeckin_time <= activity.time_final){
                  activity_uid = uid; // UID do doc no firestone
                    var players = new Array();
                    var tmp_players = activity.players;
                    var last = tmp_players.length;
                    for(i=0;i<last;i++){
                      if(tmp_players[i].user_UID == user_UID){
                        score = tmp_players[i].score;
                        alert('Retornando para o Jogo!');
                        window.location.href = "./menu.html?activity_uid="+activity_uid;
                      }else{
                        let quiz_answered = new Array();
                        for (i=0; i<atual_quiz_answered.length;i++){
                          quiz_answered[i] = atual_quiz_answered[i];
                        }
                        let tokens_quiz_used = new Array();
                        for (i=0; i<atual_tokens_quiz_used.length;i++){
                          tokens_quiz_used[i] = atual_tokens_quiz_used[i];
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
                    boardgamesService.update(activity_uid, {players}).then(window.location.href = "./menu.html?activity_uid="+activity_uid);
              }
            }else{
              alert("Atividade fora do prazo!");
            }
      //}).catch((error) => {
      //  console.log(error.menssage);
      })
    })
  }
})

function voltar(){
  window.location.href = "../home/home.html";
}

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../login/login.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}
