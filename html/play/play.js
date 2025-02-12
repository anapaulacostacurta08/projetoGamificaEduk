firebase.auth().onAuthStateChanged((User) => {
  if (!User) {
      window.location.href = "../login/login.html";
  }else{
    userService.findByUid(User.uid).then(user=>{
      document.getElementById("nameUser").innerHTML = user.nickname;
      //var user_UID = User.uid;
      var avatar = user.avatar;
      document.getElementById("avatarUser").innerHTML ='<img class="img-fluid rounded-circle img-thumbnail" src="../../assets/img/perfil/'+avatar+'.png" width="50" height="50"></img>';
      document.getElementById("score_total").innerHTML = user.score;
    }).catch(error => {
        console.log(error);
    });

    document.getElementById("play-form").addEventListener("submit", function(event) {
      event.preventDefault();
      // Captura os dados do formulário
      let activity_id = document.getElementById("activity_id").value;
      let activity_level;
      let activity_uid; // UID do doc no firestone
      let activityid; // 
      let score = 0;

      boardgamesService.getActivities(activity_id).then((activities) => {
        activities.forEach(activity => {
          activityid = activity.dados.activity_id;
          if(activityid == activity_id){
            activity_uid = activity.uid; // UID do doc no firestone
            activity_level = activity.dados.activity_level;
            var tmp_players = activity.dados.activity_players;
            if (tmp_players === undefined){
              let activity_players = new Array();
              activity_players.push({user_UID:User.uid,activity_score:score});
              boardgamesService.update(activity_uid, {activity_players});
            }else{
              let activity_players = new Array();
              //variável para verficar se o jogador já entrou no tabuleiro
              let isOnPlayer = false;
              tmp_players.forEach(player => {
                if(player.user_UID == User.uid){
                  isOnPlayer = true;
                  score = player.activity_score;
                }
                activity_players.push({user_UID:player.user_UID,activity_score:player.activity_score});
              });
              if (isOnPlayer){
                alert('Retornando para o Jogo!');
              }else{
                activity_players.push({user_UID:User.uid,activity_score:score});
                boardgamesService.update(activity_uid, {activity_players});
              }
            }
          }
        });
        window.location.href = "./menu.html";
      });
    });
  }
});

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
